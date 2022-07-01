import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProjectTargets({ match }) {
    const { path } = match;

    useEffect(() => {
        //const subscription = accountService.user.subscribe(x => setUser(x));
        //return subscription.unsubscribe;
        alert("hi");
    google.charts.load('current', {packages:['corechart']});
    google.charts.setOnLoadCallback(loadAllProjects);

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
var stat = document.getElementById('infoboxName');

var apiResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/get3?from=2022-06-19&to=2022-06-25&projectId="+projectId);
var jsonParsedContents = await apiResponse.json(); // This is also a promise so must also wait for it
console.log(jsonParsedContents); // Do whatever you need with the object

//  nameElement.textContent = jsonParsedContents.totalEntries;
//  genderElement.textContent = jsonParsedContents.timesheets[0].username;
  
  
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








var apiTargetsResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/gettargets?from=2022-06-19&to=2022-06-25&projectId="+projectId);
var jsonParsedContentsTargets = await apiTargetsResponse.json(); // This is also a promise so must also wait for it

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


    return (
        <div>

            <h1>Admin</h1>
            <p>This section can only be accessed by administrators 2.</p>
            <p><Link to={`${path}/users`}>Manage Users</Link></p>


  Project: <div id="dropdownContainer"></div>
  
  <span id='colchart_before' ></span>
  

  <div id='infoboxName'>
  <span id='name'>default</span>
  <p/>
  <span id='gender'></span>
</div>

        </div>
    );
}

export { ProjectTargets };