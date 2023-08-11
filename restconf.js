import { getQueryList } from "../utils/getModuleAndContainer.js"

export{moduleList, useModConList}
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

// NB. USE ESCAPE CHARACTER %2F FOR / FORWARD SLASH.

// moduleList(opt1, opt2, opt3, opt4, opt5)
// * opt1 = username
// * opt2 = password
// * opt3 = url (https://device name / IP address[:port if not standard])
// * opt4 = directory to search (absolute prefered)
// * opt5 = file extension

//useModConList(opt1, opt2, opt3, opt4)
// * opt1 = username
// * opt2 = password
// * opt3 = url (https://device name / IP address[:port if not standard])
// * opt4 = endPoint in JSON format

const httpVerb = "GET"
const contentType = "application/yang-data+json"

async function moduleList(uname, pword, hostUrl, searchDir, fileExt, saveFile ) {
  const endPointList = await getQueryList(searchDir, fileExt)
  const result = []
  for await (const endPointArray of endPointList)
  {
      for await (const endPoint of endPointArray)
      {
        const resultResponse = await fetch(hostUrl+endPoint, {
        method: httpVerb,
        headers: {
          "Content-Type": contentType,
          "Authorization": "Basic " + btoa(uname + ":" + pword),
        },
      }).then(function (response) {
        console.log(response)
        if (response.status > 199 && response.status < 300){
          result.push(endPoint)
        }else{
          Deno.writeTextFile(saveFile+"error", "Header " + response.status + ", " + response.statusText)
        }
      }).catch((error) => {
        console.log("catch error")
        Deno.writeTextFile(saveFile+"error", "catch error " + error)
      })
    }
  }
  return result
}


async function useModConList(uname, pword, hostUrl, useFile) {
  const endPointList = await Deno.readTextFile(useFile);
  const result = []
  for await (const endPoint of JSON.parse(endPointList))
  {
        const resultResponse = await fetch(hostUrl+endPoint, {
        method: httpVerb,
        headers: {
          "Content-Type": contentType,
          "Authorization": "Basic " + btoa(uname + ":" + pword),
        },
      }).then(function (response) {
        if (response.status === 204) {
          result.push(JSON.parse(["\"" + endPoint.slice(15,endPoint.length) + "\""]))
          result.push(JSON.parse(["\"" + response.status + " " + response.statusText + "\""]))
        }else{
          return response.json()
        }
      }).catch((error) => {
        console.log("catch error")
        Deno.writeTextFile(saveFile+"error", "catch error " + error)
      })
      result.push(resultResponse);
  }
  return result
}