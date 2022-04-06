import { Lambda } from "@aws-sdk/client-lambda"
import admzip from "adm-zip"

const lambda = new Lambda({
    region: "us-west-1",
})

const [, , folder] = process.argv
const { lambdaName } = folder.match(/^service\/(?<lambdaName>[\w\-]+)/).groups

console.log(folder)
console.log(lambdaName)

const code = new admzip()
code.addLocalFolder(folder)
const codeBuffer = code.toBuffer()

await lambda.updateFunctionCode({
    FunctionName: lambdaName,
    ZipFile: codeBuffer
})
console.log(`Uploaded ${lambdaName}`)
