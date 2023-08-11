export {getQueryList}

//Return an Array list of Restconf Modules and Containers from yang modules
async function getQueryList(dirToSearch, extension) {
    const listOfFiles = await getListOfFiles(dirToSearch, extension)
    const list = []
    const result = []
    for await (const file of listOfFiles)
    {
        list.push(await getListOfModuleContainers(file))
    }
    for (let i = 0; i < list.length; i++){
        if (list[i].length !== 0) {
            result.push(list[i])
        } 
    }
    return result
}
//Returns an Array list of files with a specific extension in a directory
async function getListOfFiles(dirToSearch, extension){
    const result = []
    for await (const list of Deno.readDir(dirToSearch))
    {
        if (list.isFile === true && list.name.search(extension) > -1) {
            result.push(dirToSearch + list.name);
        }
    }
    return result;
}

//const fileNameToQuery = "./yang/vendor/cisco/xe/1761/Cisco-IOS-XE-crypto-pki-oper.yang"
//Return an Array list of Module and Container for each YANG file quieried
async function getListOfModuleContainers(fileNameToQuery){
    const readFile = await Deno.readTextFile(fileNameToQuery)
    const intModStartPos = readFile.indexOf("module")+7
    const intModEndPos = readFile.indexOf("{")-1
    const strModule = readFile.slice(intModStartPos, intModEndPos)
    let intConStartPos = 0 
    let intConEndPos = 0 
    let strContainer = ""
    let intIndex = 0
    let intPosition = 0
    const result = []
    let intContainerCount = readFile.match(/container/g)
    if (intContainerCount === null) {
        intContainerCount = 0
    }else{
        intContainerCount = readFile.match(/container/g).length
    }
    while (intIndex < intContainerCount) {
        intConStartPos = readFile.indexOf("container", intPosition)+10
        intConEndPos = readFile.indexOf("{",intConStartPos)-1
        strContainer = readFile.slice(intConStartPos, intConEndPos)

        if (result.indexOf("/restconf/data/"+strModule+":"+strContainer) === -1 && strContainer.match("\n") === null) {
            result.push("/restconf/data/"+strModule+":"+strContainer)
        }
        intPosition = readFile.indexOf("container", readFile.indexOf("container") +1)
        intIndex++
    }
    return result
}