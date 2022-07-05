import React, { useState, useEffect } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom/cjs/react-dom.development';
import { Link } from 'react-router-dom';
import Select from 'react-select'
import 'rsuite/dist/rsuite.min.css';
import { DateRangePicker } from 'rsuite';
import { startOfDay, endOfDay, addDays, subDays, startOfISOWeek, endOfISOWeek } from 'date-fns';


function ProjectTargets({ match }) {
    const { path } = match;
    const [projects, setProjects] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [datesSelected, setDatesSelected] = useState([new Date('2022-07-01'), new Date('2022-07-08')]);

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
        console.log("starting useEffect()");
        //var lastMonday = getNextDayOfWeek(addDays(new Date(), -7), 1);
        //var nextSunday = getNextDayOfWeek(addDays(new Date(), 1), 0);
        var lastMonday = startOfISOWeek(new Date(), {weekStartsOn: 1});
        var nextSunday = endOfISOWeek(new Date(), {weekStartsOn: 1});
        //alert(lastMonday);
        //alert(nextSunday);
        setDatesSelected([lastMonday, nextSunday]);

        google.charts.load('current', {packages:['corechart']});
        //google.charts.setOnLoadCallback(loadAllProjects);
        getApiData();
        }, []);

/*
        function addDays(date, days) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
        }
*/

async function loadTargetsForProjectId(projectId, from, to){
    console.log("Load Targets for Project: " + projectId);
    console.log("from: " + from + "  to: " + to);
    var from_ = from.getFullYear() + '-' + ("00" + (from.getMonth()+1)).slice(-2) + '-' + ("00" + (from.getDate())).slice(-2);
    var to_ = to.getFullYear() + '-' + ("00" + (to.getMonth()+1)).slice(-2) + '-' + ("00" + (to.getDate())).slice(-2);
    console.log("from_: " + from_ + "  to_: " + to_);

//var stat = document.getElementById('infoboxName');

//var apiResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/get3?from=2022-06-19&to=2022-06-25&projectId="+projectId);
const apiResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/get3?from="+from_+"&to="+to_+"&projectId="+projectId,
        {
            "method": "GET"
        });
//        .then((response) => response.json());
        
var jsonParsedContents = await apiResponse.json(); // This is also a promise so must also wait for it
console.log(jsonParsedContents); // Do whatever you need with the object

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








var apiTargetsResponse = await fetch("https://frogslayerdeliverydashboard.azurewebsites.net/Timesheet/gettargets?from="+from_+"&to="+to_+"&projectId="+projectId,
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
     console.log("starting projectsSelectOptions");
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

    loadTargetsForProjectId(selectedProjectItem.value, datesSelected[0], datesSelected[1]);
  }
  
/*
  function getLastMonday(date) {
    // Copy date so don't modify original
    let d = new Date(date);
    // Adjust to previous Saturday
    d.setDate(d.getDate() - (d.getDay() + 1));
    return d;
  }
  function getNextDayOfWeek(d, dow){
    d.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
    return d;
}
*/

  function onDateSelectedChange(value)
  {
    if ( value )
    {
      console.log(value);
      /////var from = value[0].getFullYear() + '-' + ("00" + (value[0].getMonth()+1)).slice(-2) + '-' + ("00" + (value[0].getDate())).slice(-2);
      /////var to = value[1].getFullYear() + '-' + ("00" + (value[1].getMonth()+1)).slice(-2) + '-' + ("00" + (value[1].getDate())).slice(-2);
      /////console.log("from: " + from);
      /////console.log("to: " + to);
      //setDatesSelected([new Date(from), new Date(to)]);
      setDatesSelected(value);
      loadTargetsForProjectId(selectedProject.value, value[0], value[1]);
    }
  }

    return (
        <div style={{ width: "100%" }}>

<h1>Project Targets</h1>
            <p>View user target hours vs actual entered hours for the selected project.</p>

            <DateRangePicker 
              value={datesSelected}
              onChange={onDateSelectedChange}
              oneTap 
              showOneCalendar 
              isoWeek="true"
              hoverRange="week" 
              ranges={[
                {
                  label: 'this week',
                  value: [startOfISOWeek(new Date(), {weekStartsOn: 1}), endOfISOWeek(new Date(), {weekStartsOn: 1})]
                },
                {
                  label: 'last week',
                  value: [startOfISOWeek(subDays(new Date(),7), {weekStartsOn: 1}), endOfISOWeek(subDays(new Date(), 7), {weekStartsOn: 1})]
                }
              ]} 
              />
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