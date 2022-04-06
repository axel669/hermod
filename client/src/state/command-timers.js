import { commands } from "./settings"
import bridge from "@/comm/bridge"

const timers = {}

function add(cmd) {
    // console.log("adding timer", cmd.id, cmd.freq)
    timers[cmd.id] = {
        id: cmd.id,
        freq: cmd.freq,
        interval: setInterval(
            () => bridge.emit("timer.trigger", cmd.id),
            cmd.freq * 1000
        )
    }
}

function remove(id) {
    // console.log("removing timer", id)
    clearInterval(timers[id].interval)
    delete timers[id]
}

function update(cmd) {
    remove(cmd)
    add(cmd)
}

function diffCommand(cmd) {
    if (cmd.enabled === false || cmd.type !== "timer") {
        return () => {}
    }
    const timer = timers[cmd.id]
    if (timer === undefined) {
        return () => add(cmd)
    }
    if (timer.freq !== cmd.freq) {
        return () => update(cmd)
    }

    return () => {}
}
function diffTimer(timer, commands) {
    const command = commands[timer.id]
    if (command === undefined || command.enabled === false) {
        return () => remove(timer.id)
    }

    return () => {}
}

commands.subscribe(
    (commands) => {
        if (commands === null) {
            return
        }

        const updates = [
            ...Object.values(commands).map(diffCommand),
            ...Object.values(timers).map(
                timer => diffTimer(timer, commands)
            )
        ]

        for (const update of updates) {
            update()
        }
    }
)
