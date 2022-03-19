import Excel from 'exceljs'

export default async function read(path) {

    let workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(`./storage/${path}.xlsx`);

    let arr = [];
    let information = {
        groups: {},
        teachers: {}
    };

    for (let name of workbook.worksheets) {
        arr = [];
        let ws = name;

        let readed = reading(ws, arr);
        information = creatingTab(...readed, information.groups, information.teachers);
    }
    return information;
}


function reading(ws,arr) {
        let a = ws.getRow(2);
        a.eachCell({ includeEmpty: true }, function(cell, ColumnNumber) {
            let str = cell.value;
            if (typeof(str) == 'string' && str.length == 10) 
                arr.push([str,ColumnNumber])
          });
        return [ws,arr]
}

function creatingTab(ws,arr,groups,teachers) {
    for (let j = 0; j<arr.length; j++)
          {
          let groupName = arr[j][0];
          groups[`${groupName}`] = {table: {}};
  
          let i = -2;
  
          let a = ws.getColumn(arr[j][1],arr[j][1]+1);
          let b = ws.getColumn(arr[j][1]+1);
          let c = ws.getColumn(arr[j][1]+2);
          let d = ws.getColumn(arr[j][1]+3);
  
  
          a.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
              if (i>=1 && i<73) {
                  let name = cell.value;
                  let view = b.values[rowNumber];
                  let teacher = c.values[rowNumber];
                  let room = d.values[rowNumber];
                  if (!name)
                      name = '',view = '', teacher = '', room = '';
                  else 
                  {   
                      if (!teachers[teacher])
                          teachers[teacher] = {table: {}};
  
                      else if (!!teachers[teacher].table[i]) {
                          teachers[teacher].table[i].groupName += `${groupName}, `;
                      }
                      else {
                      teachers[teacher].table[i] = {name,view,room, groupName : `${groupName}, `};
                      }
                  }
                  groups[`${groupName}`].table[i] = {name,view,teacher,room};
              }
              i++;
            });
          }
          return {groups,teachers}
}
