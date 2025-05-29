import { validatePackageDescriptor } from "dpkit"

const { valid, errors } = await validatePackageDescriptor({
  descriptor: { name: "package" },
})

console.log(valid)
// false
console.log(errors)
//[
//  {
//    instancePath: '',
//    schemaPath: '#/required',
//    keyword: 'required',
//    params: { missingProperty: 'resources' },
//    message: "must have required property 'resources'",
//    type: 'descriptor'
//  }
//]
