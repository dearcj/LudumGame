const objFolder = './Objects/';
const baseObjFolder = './Neu/BaseObjects/';

const levelsFolder = './Levels/';

const fs = require('fs');
const path = require('path');
let ws = fs.createWriteStream("./ObjectsList.ts");

getFileList = (files) => {
    let shortFiles = [];
    files.forEach(file => {
        let match = new RegExp(/\.(ts)/g);
        if (match.test(file)) {
            let fileName = path.basename(file, path.extname(file));
            shortFiles.push(fileName);
        }
    });
    return shortFiles;
};


fs.readdir(objFolder, (err, files) => {
    let shortFiles = [];
    shortFiles = shortFiles.concat(getFileList(files));

    shortFiles.forEach(str => {
        ws.write("import {" + str + "} from " + '"' + "./Objects/" + str + '";\n')
    });

    fs.readdir(baseObjFolder, (err, files) => {
        let baseObjFiles = getFileList(files);
        shortFiles = shortFiles.concat(baseObjFiles);

        baseObjFiles.forEach(str => {
            ws.write("import {" + str + "} from " + '"' + "./Neu/BaseObjects/" + str + '";\n')
        });

        ws.write("\nexport let ObjectNames = {\n");
        shortFiles.forEach(str => {
            ws.write("  " + str + " :" + str + ",\n")
        });
        ws.write("};");

    });




    fs.readdir(levelsFolder, (err, files) => {

        let shortLevelFiles = [];
        files.forEach(file => {
            let match = new RegExp(/\.(tmx|tsx)/g);
            let ext = path.extname(file);
            if (ext == '.tmx' || ext == '.tsx') {
                console.log(file);
                //let fileName = path.basename(file, path.extname(file));
                shortLevelFiles.push(file);
            }
        });

        ws.write("\nexport let LevelNames = [\n");
        shortLevelFiles.forEach(str => {
            ws.write('  "levels/' + str + '"' +",\n")
        });

        ws.write("];");
        ws.end();

    });


});



