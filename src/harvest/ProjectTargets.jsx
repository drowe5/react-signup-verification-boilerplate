import React, { useState, useEffect } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom/cjs/react-dom.development';
import { Link } from 'react-router-dom';
import Select from 'react-select'

function ProjectTargets({ match }) {
    const { path } = match;
    const [projects, setProjects] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

      // Function to collect data
      const getApiData = async () => {
        const response = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Project/get3",
        {
            "method": "GET"
        })
        .then((response) => response.json());
    
        console.log(response.projects);
        setProjects(response.projects);
      };
      
      useEffect(() => {
        google.charts.load('current', {packages:['corechart']});
        //google.charts.setOnLoadCallback(loadAllProjects);
        getApiData();
        }, []);



  var nameElement = document.getElementById('name');
  var genderElement = document.getElementById('gender');

//  alert(nameElement?.innerText);
function onProjectSelected(sender) {
	//console.log(sender);
  var selectElement = sender.target;
  var selectedProjectId = selectElement.options[selectElement.selectedIndex].value;
	//alert("Project selected: "+selectedProjectId);
  loadTargetsForProjectId(selectedProjectId);
}


function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populateDropdown(values, htmlElementName, onchangeCallback) {
 
//    var values = ["dog", "cat", "parrot", "rabbit"];
 		var parent = document.getElementById(htmlElementName);
    if (parent) {
    	removeAllChildNodes(parent);
    }
 
    var select = document.createElement("select");
    select.name = "select_"+htmlElementName;
    select.id = "select_"+htmlElementName;
    select.onchange = onchangeCallback;
 
 	  //Add a default option/placeholder
    var option = document.createElement("option");
    option.value = 0;
    option.text = "Select Project";
    select.appendChild(option);

    for (const val of values)
    {
        var option = document.createElement("option");
        option.value = val[1];
        option.text = val[0];
        select.appendChild(option);
    }
  
//    document.getElementById("dropdownContainer").appendChild(label).appendChild(select);
    document.getElementById(htmlElementName).appendChild(select);

}

async function loadAllProjects() {
var apiProjectsResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Project/get3");
var jsonParsedContentsProjects = await apiProjectsResponse.json(); 


//var projectId = jsonParsedContentsProjects.projects[1].projectId;
//console.log(projectId);

const projectsArr = [];
for (const project of jsonParsedContentsProjects.projects) {
	projectsArr.push([project.projectName, project.projectId]);
}

populateDropdown(projectsArr, "dropdownContainer", onProjectSelected);
}

async function loadTargetsForProjectId(projectId){
    console.log("Load Targets for Project: " + projectId);
//var stat = document.getElementById('infoboxName');

//var apiResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/get3?from=2022-06-19&to=2022-06-25&projectId="+projectId);
const apiResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/get3?from=2022-06-19&to=2022-06-25&projectId="+projectId,
        {
            "method": "GET"
        });
//        .then((response) => response.json());
        
var jsonParsedContents = await apiResponse.json(); // This is also a promise so must also wait for it
console.log(jsonParsedContents); // Do whatever you need with the object

//  nameElement.textContent = jsonParsedContents.totalEntries;
//  genderElement.textContent = jsonParsedContents.timesheets[0].username;
console.log("HERE");  
  
  var oldData = google.visualization.arrayToDataTable([
      ['Name', 'Popularity'],
      ['Cesar', 250],
      ['Rachel', 4200],
      ['Patrick', 2900],
      ['Eric', 8200]
    ]);
  var options = { 
  	legend: { position: 'top' }, 
    diff: { newData: { widthFactor: 0.5 } }
  };
const map1 = new Map();

for (const ts of jsonParsedContents.timesheets) {
  if(map1.get(ts.username))
  {
    var t = map1.get(ts.username);
    map1.set(ts.username, t+ts.hours);
  } else {
    map1.set(ts.username, ts.hours);
  }
}
console.log(map1);
console.log(map1.get("Dusty Rowe"));








var apiTargetsResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/gettargets?from=2022-06-19&to=2022-06-25&projectId="+projectId,
{
    "method": "GET"
});
//.then((response) => response.json());

var jsonParsedContentsTargets = await apiTargetsResponse.json(); // This is also a promise so must also wait for it

console.log("TREE");
const mapTarget = new Map();

for (const ts of jsonParsedContentsTargets.timesheets) {
  if(mapTarget.get(ts.username))
  {
    var t = map1.get(ts.username);
    mapTarget.set(ts.username, t+ts.hours);
  } else {
    mapTarget.set(ts.username, ts.hours);
  }
}

const keysTargets = Array.from(mapTarget.keys());
const valuesTargets = Array.from(mapTarget.values());

const keys = Array.from(map1.keys());
const values = Array.from(map1.values());

const hours = [];
const targets = [];
hours.push(["Name", "Hours"]);
targets.push(["Name", "Hours"]);

var i=0;
for(i=0; i<keys.length; i++)
{
	hours.push([keys[i], values[i]]);
  if(mapTarget.has(keys[i]))
  {
  	targets.push([keys[i], mapTarget.get(keys[i])])
  } else {
		targets.push([keys[i], 0]);
  }
}

console.log(hours);
console.log(targets);




  var myData = google.visualization.arrayToDataTable(hours);
  var targetData = google.visualization.arrayToDataTable(targets);

  var colChartBefore = new google.visualization.ColumnChart(document.getElementById('colchart_before'));
  
  //colChartBefore.draw(myData, options);
  
  
  var diffData = colChartBefore.computeDiff(targetData, myData);
  colChartBefore.draw(diffData, options);
    
}
function projectsSelectOptions()
{
    /*
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ];
      */
      const options = [];
      if (projects)
      {
        console.log(projects);
        console.log(projects?.length);
        for (const project of projects) {
            options.push({value: project.projectId, label: project.projectName});
        }
        //options.push({value: 'a', label: selectedProject+''});
        
      }

      console.log(options);
      return options;
}

function onSelectedProjectChange(selectedProjectItem) {
    //store selected option in state
    console.log("A");
    console.log(selectedProjectItem);
    if ( selectedProjectItem )
    {
        console.log("B");
        setSelectedProject(selectedProjectItem);
    }
    console.log(selectedProject);
    console.log("c");
    console.log(selectedProjectItem);
    console.log("C");
    //alert(selectedMaterialunit);

    loadTargetsForProjectId(selectedProjectItem.value);
  }
  
  function materialUnitOptions() {
    return this.state.materialunit.map(materialUnit => (
      {
        value: materialUnit.materialunitID,
        label: `${materialUnit.unitName}:${materialUnit.materialName}`
      }
     ))
  }

    return (
        <div style={{ width: "100%" }}>

<h1>Project Targets</h1>
            <p>View user target hours vs actual entered hours for the selected project.</p>

            <Select
                value={selectedProject}
                options={projectsSelectOptions()}
                onChange={onSelectedProjectChange}
            />

  <span id='colchart_before' style={{ width: 750, height: 250, display: 'inline-block' }}></span>

        </div>
    );
}

export { ProjectTargets };