let select = document.getElementById("select");
select.addEventListener("change", function () {
  if (select.value == "rr") {
    document.getElementsByClassName("rr")[0].style.display = "block";
  } else {
    document.getElementsByClassName("rr")[0].style.display = "none";
  }
});
let btn = document.querySelector("button");
function validate(str) {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57) {
      if (str.charCodeAt(i) != 32) return false;
    }
  }
  return true;
}
function Total_process(str) {
  let flag = false;
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) != 32) {
      if (flag == false) {
        count++;
        flag = true;
      }
    } else {
      if (flag == true) {
        flag = false;
      }
    }
  }
  return count;
}
function Insert_data(str, arr, pos) {
  let res = 0,
    pre = 0,
    idx = -1,
    flag = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) != 32) {
      if (flag == false) {
        idx++;
        flag = true;
      }
      res = res * 10 + parseInt(str[i]);
      pre = res;
    } else {
      if (flag == true) {
        arr[idx][pos] = res;
        if(res==0&&pos==2)
          return true;
        arr[idx][0] = idx;
        res = 0;
        flag = false;
      }
    }
  }
  arr[idx][pos] = pre;
  if(pre==0&&pos==2)
    return true;
  arr[idx][0] = idx;
}
btn.addEventListener("click", function () {
  let val = 0;
  let arrival = document.getElementById("arrival").value.trim();
  let burst = document.getElementById("burst").value.trim();
  if (validate(arrival) == false || validate(burst) == false) {
    alert("Please enter only integers");
    reset();
    return;
  } else {
    let arr_size = Total_process(arrival);
    let burst_size = Total_process(burst);
    if (arr_size == burst_size&& arr_size!=0 &&burst_size!=0) {
      let arr = Array.from(Array(arr_size), () => new Array(6));
      for (let i = 0; i < arr.length; i++) {
        for (let j = 3; j < 6; j++) {
          arr[i][j] = 0;
        }
      }
      Insert_data(arrival, arr, 1);
      let flag=Insert_data(burst, arr, 2);
      if(flag!=true){
        select = document.getElementById("select");
        if (select.value == "fcfs") FCFS(arr);
        if (select.value == "sjf") SJF(arr);
        if (select.value == "srtf") SRTF(arr);
        if (select.value == "rr") {
          RR(arr);
        }
      }
      else{
        alert("Burst time may not be zero");
      }
    } else {
      alert("Number of the arrival times & burst times do not match");
    }
  }
});
function FCFS(arr) {
  let ct = 0;
  arr.sort(function (a, b) {
    return a[1] - b[1];
  });
  for (let i = 0; i < arr.length; i++) {
    ct = all_times(arr, i, ct);
  }
  final(arr,"FCFS");
}
function SJF(arr) {
  let temp = [],
    ct = 0;
  for (let i = 0; i < arr.length; i++) {
    temp[i] = arr[i].slice();
  }
  for (let i = 0; i < arr.length; i++) {
    let idx = sjf_time(temp, ct);
    ct = all_times(arr, idx, ct);
    temp.sort(function (a, b) {
      return a[0] - b[0];
    });
    temp[idx][1] = -1;
  }
  final(arr,"SJF")
}
function sjf_time(temp, ct) {
  let min_arr = Number.MAX_VALUE,min_burst = Number.MAX_VALUE,idx = -1;
  temp.sort(function (a, b) {
    return a[1] - b[1];
  });
  for (let i = 0; i < temp.length; i++) {
    if (temp[i][1] <= ct && temp[i][1] != -1) {
      if (temp[i][2] < min_arr) {
        min_arr = temp[i][2];
        idx = temp[i][0];
      }
    }
  }
  if (idx == -1) {
    for (let i = 0; i < temp.length; i++) {
      if (min_arr > temp[i][1] && temp[i][1] != -1) {
        min_arr = temp[i][1];
      }
      if (min_arr == temp[i][1] && min_burst > temp[i][2]) {
        min_burst = temp[i][2];
        idx = temp[i][0];
      }
    }
  }
  return idx;
}
function all_times(arr, idx, ct) {
  if (arr[idx][1] <= ct) {
    ct = ct + arr[idx][2];
  } else {
    ct = arr[idx][1] + arr[idx][2];
  }
  arr[idx][3] = ct;
  arr[idx][4] = ct - arr[idx][1];
  arr[idx][5] = arr[idx][4] - arr[idx][2];
  return ct;
}
function SRTF(arr) {
  let temp = [],
    ct = 0;
  for (let i = 0; i < arr.length; i++) {
    temp[i] = arr[i].slice();
  }
  while (true) {
    let val = 0;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][1] == -1) val++;
    }
    if (val == temp.length) {
      console.log(val, temp.length);
      break;
    }
    let idx = sjf_time(temp, ct);
    temp.sort(function (a, b) {
      return a[0] - b[0];
    });
    ct = all_times_srtf(arr, idx, ct, temp);
    if (temp[idx][2] > 0) {
      temp[idx][2]--;
    }
    if (temp[idx][2] == 0) temp[idx][1] = -1;
  }
  final(arr,"SRTF")
}
function all_times_srtf(arr, idx, ct, temp) {
  if (arr[idx][1] <= ct) {
    if (temp[idx][2] == 0) ct = ct;
    else {
      ct = ct + 1;
    }
  } else {
    if (temp[idx][2] == 0) ct = ct;
    else {
      if (arr[idx][3] == 0) {
        ct = arr[idx][1] + 1;
      } else {
        ct = ct + 1;
      }
    }
  }
  arr[idx][3] = ct;
  arr[idx][4] = ct - arr[idx][1];
  arr[idx][5] = arr[idx][4] - arr[idx][2];
  return ct;
}
function RR(arr) {
  let time_q = parseInt(document.getElementById("rr").value);
  let temp = [],ct = 0;
  for (let i = 0; i < arr.length; i++) {
    temp[i] = arr[i].slice();
  }
  let queue_rr = [];
  let front = -1,
    rear = 0;
  while (true) {
    let val = 0;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][1] == -1) {
        val++;
        console.log("yes", val);
      }
    }
    if (val == temp.length) {
      break;
    }
    temp.sort(function (a, b) {
      return a[1] - b[1];
    });
    let res = rr_time(temp, ct, queue_rr, front, rear, time_q);
    front = res[1];
    rear = res[2];
    idx = res[0];
    temp.sort(function (a, b) {
      return a[0] - b[0];
    });
    ct = all_times_rr(arr, idx, ct, temp, time_q);
    if (temp[idx][2] > 0) {
      temp[idx][2] = temp[idx][2] - time_q;
    }
    if (temp[idx][2] <= 0) temp[idx][1] = -1;
  }
  final(arr,"RR");
}
function all_times_rr(arr, idx, ct, temp, time_q) {
  if (arr[idx][1] <= ct) {
    if (temp[idx][2] <= 0) ct = ct;
    else {
      if (temp[idx][2] >= time_q) ct = ct + time_q;
      else ct = ct + temp[idx][2];
    }
  } else {
    if (temp[idx][2] <= 0) ct = arr[idx][1];
    else if (arr[idx][3] == 0) {
      if (temp[idx][2] >= time_q) ct = arr[idx][1] + time_q;
      else ct = arr[idx][1] + temp[idx][2];
    } else {
      if (temp[idx][2] >= time_q) ct = arr[idx][3] + time_q;
      else ct = arr[idx][3] + temp[idx][2];
    }
  }
  arr[idx][3] = ct;
  arr[idx][4] = ct - arr[idx][1];
  arr[idx][5] = arr[idx][4] - arr[idx][2];
  return ct;
}
let make_idx = -1;
function rr_time(temp, ct, queue_rr, front, rear, time_q) {
  let min_arr = Number.MAX_VALUE,min_burst = Number.MAX_VALUE,idx = -1;
  let f = 0;
  for (let i = 0; i < temp.length; i++) {
    if (temp[i][1] <= ct && temp[i][1] != -1) {
      if (front != -1) {
        for (let j = front; j < rear; j++) {
          if (queue_rr[j] == temp[i][0]) f++;
        }
        if (f == 0) {
          queue_rr[rear] = temp[i][0];
          rear++;
        }
      } else {
        queue_rr[rear] = temp[i][0];
        rear++;
      }
      idx = temp[i][0];
    }
    f = 0;
  }
  if (idx == -1) {
    for (let i = 0; i < temp.length; i++) {
      if (min_arr > temp[i][1] && temp[i][1] != -1) {
        min_arr = temp[i][1];
      }
      if (min_arr == temp[i][1] && min_burst > temp[i][2]) {
        min_burst = temp[i][2];
        if (make_idx != temp[i][0]) {
          queue_rr[rear] = temp[i][0];
          rear++;
        }
        idx = temp[i][0];
      }
    }
  }
  if (make_idx != -1) {
    queue_rr[rear] = make_idx;
    rear++;
  }
  front++;
  temp.sort(function (a, b) {
    return a[0] - b[0];
  });
  if (temp[queue_rr[front]][2] - time_q > 0) {
    make_idx = queue_rr[front];
  } else {
    make_idx = -1;
  }
  return [queue_rr[front], front, rear];
}
function scorecard_time(arr) {
  console.log(arr + "yes");
  let ct = 0,tat = 0,wt = 0,size = arr.length;
  let table = document.getElementById("table_data");
  if (table.children.length > 1) {
    for (let i = table.children.length - 1; i >= 1; i--) {
      table.children[i].remove();
    }
  }
  arr.sort(function (a, b) {
    return a[0] - b[0];
  });
  if (table.children.length == 1) {
    for (let i = 0; i < arr.length; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < 6; j++) {
        let td = document.createElement("td");
        if (j == 0) td.innerText = `P${arr[i][j] + 1}`;
        else td.innerText = arr[i][j];
        tr.append(td);
        if (j == 3) ct += arr[i][j];
        if (j == 4) tat += arr[i][j];
        if (j == 5) wt += arr[i][j];
      }
      table.append(tr);
    }
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    td1.innerText = "Average";
    td1.colSpan = 3;
    td2.innerText =
      ct + " / " + size + " = " + Math.floor((ct / size) * 1000) / 1000;
    td3.innerText =
      tat + " / " + size + " = " + Math.floor((tat / size) * 1000) / 1000;
    td4.innerText =
      wt + " / " + size + " = " + Math.floor((wt / size) * 1000) / 1000;
    tr.append(td1, td2, td3, td4);
    table.append(tr);
  }
  document.getElementById("tat").innerText =
    Math.floor((tat / size) * 1000) / 1000;
  document.getElementById("wt").innerText =
    Math.floor((wt / size) * 1000) / 1000;
}
function reset() {
  window.location.reload();
}
let para = document.getElementById("para");
function final(arr,str){
  para.innerHTML = "";
  para.style.display = "block";
  para.innerHTML = str;
  scorecard_time(arr);
}