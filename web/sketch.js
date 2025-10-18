let color="#FF0000"
let first_pa=null;
let second_pa=null;
let first_la=null;
let second_la=null;
let ram_time=0;
let compute_time=0;
let page_time=0;

function setup() {
  createCanvas(1535, 695);
}

function draw() {
  background(0);
  
  // RAM
  rect(750, 100, 340, 200);
  strokeWeight(1)
  fill(255); 
  textSize(24);
  text("RAM", 750, 90);
  stroke(0);

  // Row 1
// Row 1
if(first_pa=="0x00"||second_pa=="0x00"){
  fill(color); rect(750, 100, 85, 50); fill(0); textSize(16); text("0x00", 750 + 20, 100 + 30);
  setTimeout(() => { fill(255); rect(750, 100, 85, 50); fill(0); textSize(16); text("0x00", 750 + 20, 100 + 30); }, ram_time);
} else {
  fill(255); rect(750, 100, 85, 50); fill(0); textSize(16); text("0x00", 750 + 20, 100 + 30);
}

if(first_pa=="0x01"||second_pa=="0x01"){
  fill(color); rect(835, 100, 85, 50); fill(0); text("0x01", 835 + 20, 100 + 30);
  setTimeout(() => { fill(255); rect(835, 100, 85, 50); fill(0); text("0x01", 835 + 20, 100 + 30); }, ram_time);
} else {
  fill(255); rect(835, 100, 85, 50); fill(0); text("0x01", 835 + 20, 100 + 30);
}

if(first_pa=="0x02"||second_pa=="0x02"){
  fill(color); rect(920, 100, 85, 50); fill(0); text("0x02", 920 + 20, 100 + 30);
  setTimeout(() => { fill(255); rect(920, 100, 85, 50); fill(0); text("0x02", 920 + 20, 100 + 30); }, ram_time);
} else {
  fill(255); rect(920, 100, 85, 50); fill(0); text("0x02", 920 + 20, 100 + 30);
}

if(first_pa=="0x03"||second_pa=="0x03"){
  fill(color); rect(1005, 100, 85, 50); fill(0); text("0x03", 1005 + 20, 100 + 30);
  setTimeout(() => { fill(255); rect(1005, 100, 85, 50); fill(0); text("0x03", 1005 + 20, 100 + 30); }, ram_time);
} else {
  fill(255); rect(1005, 100, 85, 50); fill(0); text("0x03", 1005 + 20, 100 + 30);
}

// Row 2
if(first_pa=="0x04"||second_pa=="0x04"){
  fill(color); rect(750, 150, 85, 50); fill(0); text("0x04", 750 + 20, 150 + 30);
  setTimeout(() => { fill(255); rect(750, 150, 85, 50); fill(0); text("0x04", 750 + 20, 150 + 30); }, ram_time);
} else {
  fill(255); rect(750, 150, 85, 50); fill(0); text("0x04", 750 + 20, 150 + 30);
}

if(first_pa=="0x05"||second_pa=="0x05"){
  fill(color); rect(835, 150, 85, 50); fill(0); text("0x05", 835 + 20, 150 + 30);
  setTimeout(() => { fill(255); rect(835, 150, 85, 50); fill(0); text("0x05", 835 + 20, 150 + 30); }, ram_time);
} else {
  fill(255); rect(835, 150, 85, 50); fill(0); text("0x05", 835 + 20, 150 + 30);
}

if(first_pa=="0x06"||second_pa=="0x06"){
  fill(color); rect(920, 150, 85, 50); fill(0); text("0x06", 920 + 20, 150 + 30);
  setTimeout(() => { fill(255); rect(920, 150, 85, 50); fill(0); text("0x06", 920 + 20, 150 + 30); }, ram_time);
} else {
  fill(255); rect(920, 150, 85, 50); fill(0); text("0x06", 920 + 20, 150 + 30);
}

if(first_pa=="0x07"||second_pa=="0x07"){
  fill(color); rect(1005, 150, 85, 50); fill(0); text("0x07", 1005 + 20, 150 + 30);
  setTimeout(() => { fill(255); rect(1005, 150, 85, 50); fill(0); text("0x07", 1005 + 20, 150 + 30); }, ram_time);
} else {
  fill(255); rect(1005, 150, 85, 50); fill(0); text("0x07", 1005 + 20, 150 + 30);
}

// Row 3
if(first_pa=="0x08"||second_pa=="0x08"){
  fill(color); rect(750, 200, 85, 50); fill(0); text("0x08", 750 + 20, 200 + 30);
  setTimeout(() => { fill(255); rect(750, 200, 85, 50); fill(0); text("0x08", 750 + 20, 200 + 30); }, ram_time);
} else {
  fill(255); rect(750, 200, 85, 50); fill(0); text("0x08", 750 + 20, 200 + 30);
}

if(first_pa=="0x09"||second_pa=="0x09"){
  fill(color); rect(835, 200, 85, 50); fill(0); text("0x09", 835 + 20, 200 + 30);
  setTimeout(() => { fill(255); rect(835, 200, 85, 50); fill(0); text("0x09", 835 + 20, 200 + 30); }, ram_time);
} else {
  fill(255); rect(835, 200, 85, 50); fill(0); text("0x09", 835 + 20, 200 + 30);
}

if(first_pa=="0x0A"||second_pa=="0x0A"){
  fill(color); rect(920, 200, 85, 50); fill(0); text("0x0A", 920 + 20, 200 + 30);
  setTimeout(() => { fill(255); rect(920, 200, 85, 50); fill(0); text("0x0A", 920 + 20, 200 + 30); }, ram_time);
} else {
  fill(255); rect(920, 200, 85, 50); fill(0); text("0x0A", 920 + 20, 200 + 30);
}

if(first_pa=="0x0B"||second_pa=="0x0B"){
  fill(color); rect(1005, 200, 85, 50); fill(0); text("0x0B", 1005 + 20, 200 + 30);
  setTimeout(() => { fill(255); rect(1005, 200, 85, 50); fill(0); text("0x0B", 1005 + 20, 200 + 30); }, ram_time);
} else {
  fill(255); rect(1005, 200, 85, 50); fill(0); text("0x0B", 1005 + 20, 200 + 30);
}

// Row 4
if(first_pa=="0x0C"||second_pa=="0x0C"){
  fill(color); rect(750, 250, 85, 50); fill(0); text("0x0C", 750 + 20, 250 + 30);
  setTimeout(() => { fill(255); rect(750, 250, 85, 50); fill(0); text("0x0C", 750 + 20, 250 + 30); }, ram_time);
} else {
  fill(255); rect(750, 250, 85, 50); fill(0); text("0x0C", 750 + 20, 250 + 30);
}

if(first_pa=="0x0D"||second_pa=="0x0D"){
  fill(color); rect(835, 250, 85, 50); fill(0); text("0x0D", 835 + 20, 250 + 30);
  setTimeout(() => { fill(255); rect(835, 250, 85, 50); fill(0); text("0x0D", 835 + 20, 250 + 30); }, ram_time);
} else {
  fill(255); rect(835, 250, 85, 50); fill(0); text("0x0D", 835 + 20, 250 + 30);
}

if(first_pa=="0x0E"||second_pa=="0x0E"){
  fill(color); rect(920, 250, 85, 50); fill(0); text("0x0E", 920 + 20, 250 + 30);
  setTimeout(() => { fill(255); rect(920, 250, 85, 50); fill(0); text("0x0E", 920 + 20, 250 + 30); }, ram_time);
} else {
  fill(255); rect(920, 250, 85, 50); fill(0); text("0x0E", 920 + 20, 250 + 30);
}

if(first_pa=="0x0F"||second_pa=="0x0F"){
  fill(color); rect(1005, 250, 85, 50); fill(0); text("0x0F", 1005 + 20, 250 + 30);
  setTimeout(() => { fill(255); rect(1005, 250, 85, 50); fill(0); text("0x0F", 1005 + 20, 250 + 30); }, ram_time);
} else {
  fill(255); rect(1005, 250, 85, 50); fill(0); text("0x0F", 1005 + 20, 250 + 30);
}


  // Line from RAM to CACHE
  stroke(255);
  strokeWeight(5);
  line(920, 300, 920, 400);

  // CACHE
  rect(750, 400, 340, 200);
  fill(255);
  textSize(24);
  strokeWeight(1);
  text("CACHE", 750, 390);
  stroke(0);

  if(first_pa=="0x01"||second_pa=="0x01"){
    fill(color); rect(750, 400, 85, 200); fill(0); text("0x01", 750+15,400+110);
    setTimeout(() => { 
      fill(255); rect(750, 400, 85, 200); 
      fill(0); text("0x01", 750+15,400+110); 
    }, ram_time);
  } else {
    fill(255); rect(750, 400, 85, 200); fill(0); text("0x01", 750+15,400+110);
  }

  if(first_pa=="0x02"||second_pa=="0x02"){
    fill(color); rect(835, 400, 85, 200); fill(0); text("0x02", 835+15,400+110);
    setTimeout(() => { 
      fill(255); rect(835, 400, 85, 200); 
      fill(0); text("0x02", 835+15,400+110); 
    }, ram_time);
  } else {
    fill(255); rect(835, 400, 85, 200); fill(0); text("0x02", 835+15,400+110);
  }

  if(first_pa=="0x03"||second_pa=="0x03"){
    fill(color); rect(920, 400, 85, 200); fill(0); text("0x03", 920+15,400+110);
    setTimeout(() => { 
      fill(255); rect(920, 400, 85, 200); 
      fill(0); text("0x03", 920+15,400+110); 
    }, ram_time);
  } else {
    fill(255); rect(920, 400, 85, 200); fill(0); text("0x03", 920+15,400+110);
  }

  if(first_pa=="0x04"||second_pa=="0x04"){
    fill(color); rect(1005, 400, 85, 200); fill(0); text("0x04", 1005+15,400+110);
    setTimeout(() => { 
      fill(255); rect(1005, 400, 85, 200); 
      fill(0); text("0x04", 1005+15,400+110); 
    }, ram_time);
  } else {
    fill(255); rect(1005, 400, 85, 200); fill(0); text("0x04", 1005+15,400+110);
  }

  // CPU
  if(first_pa=="CPU"||second_pa=="CPU"){
    fill(color);
  } else {
    fill(200);
  }
  stroke(255);  
  strokeWeight(2);
  rect(100, 250, 200, 200);

  fill(255);  
  noStroke();
  textSize(16);
  text("CPU", 160, 240);
  fill(0);
  text(compute_time+"ms", 160,350);

  stroke(255);        
  strokeWeight(5);
  line(300, 350, 400, 400);

  
  // Page Table
  rect(370, 100, 300, 500);
  strokeWeight(1); 
  fill(255);
  textSize(16);
  text("PAGE TABLE", 370, 90);
  stroke(0);

  let ptCellW = 150;
  let ptCellH = 31.25;

  // Column 1
if(first_la=="0xA3F12"||second_la=="0xA3F12"){
  fill(color); rect(370, 100 + 0 * ptCellH, ptCellW, ptCellH); fill(0); textSize(12); text("0xA3F12", 370 + 5, 100 + 0 * ptCellH + 20);
  setTimeout(() => { fill(255); rect(370, 100 + 0 * ptCellH, ptCellW, ptCellH);
     fill(0); text("0xA3F12", 370 + 5, 100 + 0 * ptCellH + 20); }, page_time);
} else {
  fill(255); rect(370, 100 + 0 * ptCellH, ptCellW, ptCellH); fill(0); text("0xA3F12", 370 + 5, 100 + 0 * ptCellH + 20);
}

if(first_la=="0x1D4B9"||second_la=="0x1D4B9"){
  fill(color); rect(370, 100 + 1 * ptCellH, ptCellW, ptCellH); fill(0); text("0x1D4B9", 370 + 5, 100 + 1 * ptCellH + 20);
  setTimeout(() => { fill(255); rect(370, 100 + 1 * ptCellH, ptCellW, ptCellH); fill(0); text("0x1D4B9", 370 + 5, 100 + 1 * ptCellH + 20); }, page_time);
} else {
  fill(255); rect(370, 100 + 1 * ptCellH, ptCellW, ptCellH); fill(0); text("0x1D4B9", 370 + 5, 100 + 1 * ptCellH + 20);
}

if(first_la=="0xFE7C0"||second_la=="0xFE7C0"){
  fill(color); rect(370, 100 + 2 * ptCellH, ptCellW, ptCellH); fill(0); text("0xFE7C0", 370 + 5, 100 + 2 * ptCellH + 20);
  setTimeout(() => { fill(255); rect(370, 100 + 2 * ptCellH, ptCellW, ptCellH); fill(0); text("0xFE7C0", 370 + 5, 100 + 2 * ptCellH + 20); }, page_time);
} else {
  fill(255); rect(370, 100 + 2 * ptCellH, ptCellW, ptCellH); fill(0); text("0xFE7C0", 370 + 5, 100 + 2 * ptCellH + 20);
}

if(first_la=="0x09AB7"||second_la=="0x09AB7"){
  fill(color); rect(370, 100 + 3 * ptCellH, ptCellW, ptCellH); fill(0); text("0x09AB7", 370 + 5, 100 + 3 * ptCellH + 20);
  setTimeout(() => { fill(255); rect(370, 100 + 3 * ptCellH, ptCellW, ptCellH); fill(0); text("0x09AB7", 370 + 5, 100 + 3 * ptCellH + 20); }, page_time);
} else {
  fill(255); rect(370, 100 + 3 * ptCellH, ptCellW, ptCellH); fill(0); text("0x09AB7", 370 + 5, 100 + 3 * ptCellH + 20);
}

if(first_la=="0xC4E1D"||second_la=="0xC4E1D"){
  fill(color); rect(370, 100 + 4 * ptCellH, ptCellW, ptCellH); fill(0); text("0xC4E1D", 370 + 5, 100 + 4 * ptCellH + 20);
  setTimeout(() => { fill(255); rect(370, 100 + 4 * ptCellH, ptCellW, ptCellH); fill(0); text("0xC4E1D", 370 + 5, 100 + 4 * ptCellH + 20); }, page_time);
} else {
  fill(255); rect(370, 100 + 4 * ptCellH, ptCellW, ptCellH); fill(0); text("0xC4E1D", 370 + 5, 100 + 4 * ptCellH + 20);
}

// Repeat the same pattern for all remaining rows in column 1 (0x72FA0 to 0xB7C4F)
let col1Values = ["0x72FA0","0x8B3D1","0x56E9A","0x0F1C4","0x91D2B","0x3A8E7","0xE4B19","0x6CF02","0xFA193","0x2D5E8","0xB7C4F"];
for(let i = 5; i < 16; i++){
  let val = col1Values[i-5];
  if(first_la==val || second_la==val){
    fill(color); rect(370, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370+5, 100 + i*ptCellH + 20);
    setTimeout(() => { fill(255); rect(370, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370+5, 100 + i*ptCellH + 20); }, page_time);
  } else {
    fill(255); rect(370, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370+5, 100 + i*ptCellH + 20);
  }
}

// Column 2
let col2Values = ["0x00","0x01","0x02","0x03","0x04","0x05","0x06","0x07","0x08","0x09","0x0A","0x0B","0x0C","0x0D","0x0E","0x0F"];
for(let i = 0; i < 16; i++){
  let val = col2Values[i];
  if(first_la==val || second_la==val){
    fill(color); rect(370 + ptCellW, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370 + ptCellW + 5, 100 + i*ptCellH + 20);
    setTimeout(() => { fill(255); rect(370 + ptCellW, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370 + ptCellW + 5, 100 + i*ptCellH + 20); }, page_time);
  } else {
    fill(255); rect(370 + ptCellW, 100 + i*ptCellH, ptCellW, ptCellH); fill(0); text(val, 370 + ptCellW + 5, 100 + i*ptCellH + 20);
  }
}

// Draw the connecting line
stroke(255);
strokeWeight(5);
line(670, 500, 750, 500);
}