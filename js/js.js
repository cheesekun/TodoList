//获取ID
var $ = function(id) {
  return typeof id === "string" ? document.getElementById(id) : id;
};

//获取tagName
var $$ = function(tagName, oParent) {
  return (oParent || document).getElementsByTagName(tagName);
};

var STORAGE_KEY = "todolist";
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return todos;
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};
var todos = todoStorage.fetch();

/* function today() {
  var time = new Date();
  var year = time.getYear() + 1900;
  var month = time.getMonth() + 1;
  var day = time.getUTCDate() ;
  $("time").innerHTML = year + '/' + month + '/' + day;
  console.log(day)
  
}
today();
 */
function appendTask() {
  var value = $("task_input").value;
  if (value === "") {
    return;
  }
  var mould = document.createElement("div");
  mould.className = "task";
  mould.innerHTML = '<div class="task-content">' + '<input type="checkbox" />' + '<p>' + value + '</p>' + '</div>' +
    '<button class="btn btn-5 btn-5a icon-remove"><span>Delete</span></button>';
  $("list").appendChild(mould);
  value = value.replace(/^\s*/, "").replace(/\s*$/, "");
  // 输入不能为空
  if (!value) {
    return;
  }
  todos.push(value);
  todoStorage.save(todos);
  removeNode();
  console.log(localStorage.getItem("todolist"));
}

function todolistDOM(todos) {
  var htmlstr = "";
  for (var i = 0; i < todos.length; i++) {
    var mould = document.createElement("div");
    mould.className = "task";
    mould.innerHTML = '<div class="task-content">' + '<input type="checkbox" />' + '<p>' + todos[i] + '</p>' + '</div>' +
      '<button class="btn btn-5 btn-5a icon-remove"><span>Delete</span></button>';
    $("list").appendChild(mould);
  }
  return htmlstr;
}

function removeNode() {
  for (var i = 0; i < $$("button").length; i++) {
    $$("button")[i].addEventListener("click", function() {
      $("list").removeChild(this.parentElement);
      var rmtodo = this.previousSibling.lastChild.innerHTML;
      todos.splice(todos.indexOf(rmtodo), 1);
      todoStorage.save(todos);
      //this.parentElement.previousSibling.lastChild
    });
  }
}

/* 天气板块 */
/* 拼接url */
function urlLink(city) {
  var url = "http://op.juhe.cn/onebox/weather/query?callback=callbackFun&key=ffd1cb401f9a185914db7bbd7fa2595a&cityname=";
  url += city;
  return url;
}

/* 插入script，启用jsonp */
function myFun(result) {
  var cityName = result.name;
  //console.log(urlLink(cityName));
  var url = urlLink(cityName);
  // 创建 <script> 标签，设置其 src 属性
  var script = document.createElement('script');
  script.setAttribute('src', url);
  // 把 <script> 标签加入 <body> 尾部，此时调用开始。
  document.getElementsByTagName('body')[0].appendChild(script);
}
var myCity = new BMap.LocalCity();
myCity.get(myFun);

/* 打印today信息 */
function callbackFun(data) {
  var realtime = data.result.data.realtime;
  var city = realtime.city_name;
  var temperature = realtime.weather.temperature;
  var time = realtime.date;
  var info = realtime.weather.info;
  var weekend = data.result.data.weather[0].week;
  $("city").innerHTML = "您的位置：" + city;
  $("time").innerHTML = time;
  $("weather").innerHTML = "今日气温为 " + temperature + " ℃  " + info;
  $("weekend").innerHTML = "星期" + weekend;
}

/* 循环添加 p 颜色背景 */
var color = ["#159", "#951", "915", "#357", "#735"];
var today = $("today");
var colorP = $$("p", today);
for (var i = 0; i < colorP.length; i++) {
  colorP[i].style.backgroundColor = color[i];
}

/* 随机语句 */
function randomSentence() {
  var random = ["今日份的任务，完成了吗?",
    "也快要，大学毕业了吧",
    "比你聪明的人，比你更努力地完成任务！",
    "完成任务很累是吧，想想没钱的时候",
    "多为爸妈想想，努力不止为自己",
    "希望明天的你，不会埋怨今天的自己",
    "别忘了，你只不过是个二本大学生"
  ];
  var i = Math.ceil(6 * Math.random());
  $("sentence").innerHTML = random[i];
}

window.onload = function() {
  todolistDOM(todos);
  removeNode();
  randomSentence();
  $("task_input").addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
      appendTask();
      this.value = "";
    }
  });

};