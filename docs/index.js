let dataurl;
let jsonObj;
let g;

function start(e) {

  g = new JSGantt.GanttChart(document.getElementById('embedded-Gantt'), 'week');
  if (g.getDivId() != null) {

    const newDataurl = document.getElementById('dataurl').value ? document.getElementById('dataurl').value : './fixes/data.json';
    const vDebug = document.querySelector('#debug:checked') ? true : false;
    //vDebug = true;
    const vEditable = document.querySelector('#editable:checked') ? true : false;
    const vUseSort = document.querySelector('#sort:checked') ? true : false;
    const newtooltiptemplate = document.getElementById('tooltiptemplate').value ? document.getElementById('tooltiptemplate').value : null;
    let vColumnOrder;
    if (document.querySelector('#vColumnOrder').value) {
      vColumnOrder = document.querySelector('#vColumnOrder').value.split(',')
    }

    const vScrollTo = 'today'; // or new Date() or a Date object with a specific date


    // SET LANG FROM INPUT
    lang = e && e.target ? e.target.value : 'en';
    delay = document.getElementById('delay').value;


    vUseSingleCell = document.getElementById('useSingleCell').value;
    vShowRes = document.querySelector('#vShowRes:checked') ? 1 : 0;
    vShowCost = document.querySelector('#vShowCost:checked') ? 1 : 0;
    vShowAddEntries = document.querySelector('#vShowAddEntries:checked') ? 1 : 0;
    vShowComp = document.querySelector('#vShowComp:checked') ? 1 : 0;
    vShowDur = document.querySelector('#vShowDur:checked') ? 1 : 0;
    vShowStartDate = document.querySelector('#vShowStartDate:checked') ? 1 : 0;
    vShowEndDate = document.querySelector('#vShowEndDate:checked') ? 1 : 0;
    vShowPlanStartDate = document.querySelector('#vShowPlanStartDate:checked') ? 1 : 0;
    vShowPlanEndDate = document.querySelector('#vShowPlanEndDate:checked') ? 1 : 0;
    vShowTaskInfoLink = document.querySelector('#vShowTaskInfoLink:checked') ? 1 : 0;
    vShowEndWeekDate = document.querySelector('#vShowEndWeekDate:checked') ? 1 : 0;
    vTotalHeight = document.querySelector('#vTotalHeight').value || undefined;

    vShowWeekends = document.querySelector('#vShowWeekends:checked') ? 1 : 0;

    vMinDate = document.querySelector('#vMinDate').value;
    vMaxDate = document.querySelector('#vMaxDate').value;

    vAdditionalHeaders = {
      category: {
        title: 'Category'
      },
      sector: {
        title: 'Sector'
      }
    }

    g.setOptions({
      vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,            
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vLang: lang,
      vUseSingleCell, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
      vShowRes,
      vShowCost,
      vShowAddEntries,
      vShowComp,
      vShowDur,
      vShowStartDate,
      vShowEndDate,
      vShowPlanStartDate,
      vShowPlanEndDate,
      vAdditionalHeaders,
      vTotalHeight,
      vMinDate,
      vMaxDate,
      vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log,
        beforeDraw: () => console.log('before draw listener'),
        afterDraw: () => {
          console.log('after draw listener');
          if (document.querySelector("#customElements:checked")) {
            drawCustomElements(g);
          }
        }
      },
      vEventsChange: {
        taskname: editValue.bind(this, jsonObj),
        res: editValue.bind(this, jsonObj),
        dur: editValue.bind(this, jsonObj),
        comp: editValue.bind(this, jsonObj),
        start: editValue.bind(this, jsonObj),
        end: editValue.bind(this, jsonObj),
        planstart: editValue.bind(this, jsonObj),
        planend: editValue.bind(this, jsonObj),
        cost: editValue.bind(this, jsonObj)
      },
      vResources: [
        { id: 0, name: 'Anybody' },
        { id: 1, name: 'Mario' },
        { id: 2, name: 'Henrique' },
        { id: 3, name: 'Pedro' }
      ],
      vEventClickRow: console.log,
      vShowTaskInfoLink, // Show link in tool tip (0/1)
      vShowEndWeekDate,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vShowWeekends, // Show weekends days in the vFormat day
      vTooltipDelay: delay,
      vTooltipTemplate:
        document.querySelector("#dynamicTooltip:checked") ?
          generateTooltip :
          newtooltiptemplate,
      vDebug,
      vEditable,
      vColumnOrder,
      vScrollTo,
      vUseSort,
      vFormat: 'week',
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
    });
    //DELAY FROM INPUT

    // Teste manual add task
    // g.AddTaskItemObject({
    //   pID: 100,
    //   pName: "Task 1",
    //   pStart: "2018-09-05",
    //   pEnd: "2018-09-11",
    //   pLink: "",
    //   pClass: "gtaskgreen",
    //   pMile: 0,
    //   pComp: 100,
    //   pGroup: 0,
    //   pParent: 0,
    //   pOpen: 1,
    //   pNotes: "",
    //   category: 'test'
    // });

    // Parameters                     (pID, pName,                  pStart,       pEnd,        pStyle,         pLink (unused)  pLink: pMilpMile: e, pRes,       pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
    if (dataurl !== newDataurl) {
      dataurl = newDataurl;
      JSGantt.parseJSON(dataurl, g, vDebug)
        .then(j => jsonObj = j);
    } else {
      JSGantt.addJSONTask(g, jsonObj)
    }

    if (vDebug) {
      bd = new Date();
      console.log('before reloading', bd);
    }
    g.Draw();
    //JSGantt.criticalPath(jsonObj)
    if (vDebug) {
      const ad = new Date();
      console.log('after reloading: total time', ad, (ad.getTime() - bd.getTime()));
    }

  } else {
    alert("Error, unable to create Gantt Chart");
  }

  // document.getElementById("idMainLeft").onscroll = () => { 
  //   scrollingTwoMains('idMainLeft', 'idMainRight');
  // };

  // document.getElementById('idMainRight').onscroll = () => {
  //   scrollingTwoMains('idMainRight', 'idMainLeft');
  // };
}

function scrollingTwoMains(mainMoving, mainMoved) {
  document.getElementById(mainMoved).scrollTop = document.getElementById(mainMoving).scrollTop;
}

function clearTasks() {
  g.ClearTasks();
  g.Draw()
}

function editValue(list, task, event, cell, column) {
  const found = list.find(item => item.pID == task.getOriginalID());
  if (!found) {
    return;
  }
  else {
    found[column] = event ? event.target.value : '';
  }
}

function drawCustomElements(g) {
  for (const item of g.getList()) {
    if (item.getDataObject().deadline) {
      const x = g.chartRowDateToX(new Date(item.getDataObject().deadline));
      const td = item.getChildRow().querySelector('td');
      td.style.position = 'relative';
      const div = document.createElement('div');
      div.style.left = `${x}px`;
      div.classList.add('deadline-line');
      td.appendChild(div);
    }
  }
}

function generateTooltip(task) {
  // default tooltip for level 1
  if (task.getLevel() === 1) return;

  // string tooltip for level 2. Show completed/total child count and current timestamp
  if (task.getLevel() === 2) {
    let childCount = 0;
    let complete = 0;
    for (const item of g.getList()) {
      if (item.getParent() == task.getID()) {
        if (item.getCompVal() === 100) {
          complete++;
        }
        childCount++;
      }
    }
    console.log(`Generated dynamic sync template for '${task.getName()}'`);
    return `
      <dl>
        <dt>Name:</dt><dd>{{pName}}</dd>
        <dt>Complete child tasks:</dt><dd style="color:${complete === childCount ? 'green' : 'red'}">${complete}/${childCount}</dd>
        <dt>Tooltip generated at:</dt><dd>${new Date()}</dd>
      </dl>
    `;
  }

  // async tooltip for level 3 and below
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 3000;
    setTimeout(() => {
      console.log(`Generated dynamic async template for '${task.getName()}'`);
      resolve(`Tooltip content from the promise after ${Math.round(delay)}ms`);
    }, delay);
  });
}

start('pt')