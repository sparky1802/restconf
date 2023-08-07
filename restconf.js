// RESTCONF URI
// <PROTOCOL>://<ADDRESS>:<PORT>/<ROOT>/<DATASTORE>/[YANGMODULE:]CONTAINER>/<LEAF>[?<OPTIONS>]
// PROTOCOL: https
// ADDRESS: the address of the RESTCONF agent
// PORT: 443
// ROOT: the main entry point for RESTCONF requests
// DATASTORE: the datastore that is being queried
// [YANGMODULE:]CONTAINER: the base model container being used
// LEAF: individual element from within that container
// OPTIONS: optional parameters

const protocol = "https"
const port = "443"
const hostHome = "192.168.0.4"
const hostWork = "10.21.29.6"
const depth = "?depth3"
const endPoint0 = "/restconf/data/ietf-yang-library:modules-state/module"
const endPoint1 = "/restconf/data/Cisco-IOS-XE-native:native/interface"
const endPoint2 =
  "/restconf/data/Cisco-IOS-XE-native:native/interface/GigabitEthernet=0%2F0%2F0"
const endPoint3 = "/restconf/data/ietf-restconf-monitoring:restconf-state"
const endPoint4 = "/restconf/data/cisco-self-mgmt:netconf-yang"
const endPoint5 =
  "/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0%2F0%2F0" // - note escape characters "%2F" for "/""
const endPoint6 =
  "/restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"
console.log(endPoint5)
const url = `${protocol}://${hostHome}:${port}${endPoint6}`
const username = ""
const password = ""
const authorization = "Basic " + btoa(username + ":" + password)

const httpVerb = "GET"
const contentType = "application/yang-data+json"

async function moduleList(url) {
  const results = await fetch(url, {
    method: httpVerb,
    headers: {
      "Content-Type": contentType,
      "Authorization": authorization,
    },
  }).then(function (response) {
    //    console.log(response.status)
    //    console.log(response.statusText)
    //    console.log(response.ok)
    return response.text()
  }).then(function (data) {
    return data
  })

  return results
}
const restconfModuleList = await moduleList(url)
Deno.writeTextFile(
  "./test-openconfig-bgp-testing.json",
  restconfModuleList,
)
