<template>
  <div id="board" @mousemove="mouseInfo($event)" @click="circleMode ? makeCircle($event) : null">
    <!--bootsrap Modal -->

    <div class="modal fade" tabindex="-1" id="modal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Please Input Fuel</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="calculate()">
              <div class="mb-3">
                <label for="fuel" class="col-form-label">Value:</label>
                <input v-model="maxWeight" min="0" type="number" oninput="validity.valid||(value='');" class="form-control" id="fuel" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Calculate</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <button
      class="circle-mode"
      @click="circleMode = !circleMode, transferMode = false"
    >{{ circleMode ? 'Disable Circle Mode' : 'Enable Circle Mode' }}</button>

    <button
      class="transfer-mode"
      @click="transferMode = !transferMode, circleMode = false"
    >{{ transferMode ? 'Disable Transfer Mode' : 'Enable Transfer Mode' }}</button>

    <button class="calculate-button" data-bs-toggle="modal" data-bs-target="#modal">calculate</button>
  </div>

  <div
    v-if="circleMode || transferMode"
    id="mouse-info"
  >{{ circleMode ? circleText : transferMode ? transferText : '' }}</div>

  <div
    class="status-text"
  >Status: {{ circleMode ? 'Circle Mode' : transferMode ? 'Transfer Mode' : 'Normal Mode' }}</div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { bellmanFord } from '../bellmanFord'
let circle1 = ref(null)
let circle2 = ref(null)
let circleMode = ref(false)
let transferMode = ref(false)
let maxWeight = ref(0)
let lineWeight = ref(0)
let paths = ref([])
let rootCircle = ref(null)
let mouseText = ref('')
let transferText = ref('Click an circle to transfer to')
let circleText = 'Click an area for create a circle'

const makeCircle = async (event) => {

  //gets mouse position
  const mouse = {
    x: event.clientX,
    y: event.clientY
  }

  // create a random id
  // let id = (await axios('https://cors-anywhere.herokuapp.com/http://www.randomnumberapi.com/api/v1.0/random', { params: { min: 25000, max: 100000 } })).data
  let id = (Math.floor(Math.random() * 100000) + 25000).toString()

  // div element under board id with circle class where the mouse is 
  const circle = document.createElement('div')
  circle.classList.add('circle')
  circle.style.left = mouse.x + 'px'
  circle.style.top = mouse.y + 'px'
  circle.setAttribute('id', id);
  circle.innerText = id;

  // add click events to the circle
  circle.addEventListener('click', (event) => {
    setValue(id)
  })

  circle.addEventListener('dblclick', (event) => {
    if (rootCircle.value) return alert('Root already selected')

    circle.style.backgroundColor = 'red'
    rootCircle.value = id
  })


  // if is there a another anything  on mouse location find it and alert
  if (document.elementFromPoint(mouse.x, mouse.y).classList.contains('circle-mode')) return
  if (document.elementFromPoint(mouse.x, mouse.y).classList.contains('circle')) return alert('There is a circle on this area')

  document.getElementById('board').appendChild(circle)

}

const getOffset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width || el.offsetWidth,
    height: rect.height || el.offsetHeight
  };
}

const setValue = async (id) => {
  if (!transferMode.value) return;


  if (circle1.value === null) {
    transferMode.value = true
    transferText.value = "Click for delivery point"
    circle1.value = id;
  } else {
    circle2.value = id;
  }

  if (circle1.value && circle2.value) {
    transferText.value = "'Click an circle to transfer to"
    await makeLine(circle1.value, circle2.value);
    circle1.value = null;
    circle2.value = null;
  }




}

const makeLine = async (id1, id2) => {
  if (circleMode.value || id1 === id2) {
    return alert('Error')
  }

  const board = document.getElementById('board');
  const circle1 = document.getElementById(id1);
  const circle2 = document.getElementById(id2);
  const color = "white"
  const thickness = 2;
  const off1 = getOffset(circle1);
  const off2 = getOffset(circle2);
  const x1 = off1.left + (off1.width / 2);
  const y1 = off1.top + off1.height / 2
  const x2 = off2.left + off2.width / 2;
  const y2 = off2.top + off2.height / 2;
  const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
  const cx = ((x1 + x2) / 2) - (length / 2)
  const cy = ((y1 + y2) / 2) - (thickness / 2)
  const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);



  // open modal
  const modal = document.getElementById('fuelModal')

  const data = window.prompt("Değeri Giriniz:");

  const lineID = id1 + id2;

  const htmlLine = "<div id=" + lineID + "  style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";


  // add line and text to the board
  board.insertAdjacentHTML('beforeend', htmlLine);
  const lineDiv = getOffset(document.getElementById(lineID));
  const text = document.createElement('div');
  text.classList.add('text');
  text.style.position = 'absolute';
  text.style.left = lineDiv.left + (lineDiv.width / 2) + 3 + 'px';
  text.style.top = lineDiv.top + (lineDiv.height / 2) + 'px';
  text.style.color = 'white';
  text.innerText = data;
  board.appendChild(text);

  // add line to the paths array

  paths.value.push({
    line_id: lineID,
    to: id1,
    from: id2,
    value: parseInt(data)
  })

  return;

}


const mouseInfo = (event) => {
  if (circleMode.value || transferMode.value) {

    const mouse = {
      x: event.clientX,
      y: event.clientY
    }

    let circleModText = document.getElementById('mouse-info');
    circleModText.style.position = 'absolute';
    circleModText.style.color = 'white';
    circleModText.style.zIndex = '999';
    circleModText.style.left = mouse.x + 15 + 'px';
    circleModText.style.top = mouse.y + 15 + 'px';
  }
}




const calculate = () => {

  if (maxWeight.value === 0) return alert('Max weight cannot be  0')

  if (paths.value.length === 0) return alert('There is no path')

  if (!rootCircle.value) return alert('Root circle is not selected')



  //  use bellman ford algorithm for path finding with given input and paths
  const graph = {};
  const nodes = [];
  const edges = [];

  // set destation circle
  const source = rootCircle.value

  // create graph from paths
  paths.value.forEach(path => {
    if (!graph[path.from]) {
      graph[path.from] = {};
      nodes.push(path.from);
    }
    if (!graph[path.to]) {
      graph[path.to] = {};
      nodes.push(path.to);
    }
    graph[path.from][path.to] = path.value;
    edges.push({
      source: path.to,
      target: path.from,
      weight: path.value
    })
  })

  // add source node
  graph[source] = {};
  nodes.push(source);


  // find the shortest path

  let result = bellmanFord(source, nodes, edges, maxWeight.value);


  // show the result

  if (result.pathWeight === 0) {
    alert('There is no path with given fuel')
    return
  }


  alert(
    'The shortest path is: ' +
    result.item.join(' -> ') +
    ' with a total fuel of ' +
    result.pathWeight + ' Remain Fuel: ' +
    (maxWeight.value - result.pathWeight)
  )



}



</script>



<style>
body {
  width: 100vw;
  height: 100vh;
  background-color: #575757;
  padding: 0;
  margin: 0;
  overflow: hidden;
  user-select: none;
}

.circle-mode {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  padding: 5px;
  border-radius: 5px;
}

.transfer-mode {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
  padding: 5px;
  border-radius: 5px;
}

#board {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.line {
  background: white;
}

.circle {
  width: 100px;
  height: 100px;
  color: white;
  border: 1px solid #fff;
  border-radius: 50%;
  background: #575757;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  z-index: 999;
  transform: translate(-50%, -50%);
}

.status-text {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  z-index: 999;
  padding: 5px;
}

.calculate-button {
  position: absolute;
  top: 10px;
  left: 200px;
  z-index: 100;
  padding: 5px;
  border-radius: 5px;
}
</style>