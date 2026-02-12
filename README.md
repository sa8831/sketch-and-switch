# Sketch & Switch

## Project Overview  
Sketch & Switch is an interactive drawing system inspired by the classic Etch-A-Sketch. The project integrates **Arduino hardware** with a **p5.js web interface** to translate physical knob movements into real-time digital drawing.

Two potentiometers control the X and Y position of a cursor on a canvas, while a push button toggles drawing mode and generates a new random color. The project explores hardware–software communication, serial data handling, and interactive user experience design.


## Technologies Used  
1. **Arduino (C++)** – Reads analog potentiometer values and digital button input.  
2. **p5.js** – Renders interactive graphics in the browser.  
3. **p5.webserial.js** – Enables real-time serial communication between Arduino and browser.  
4. **HTML / JavaScript** – Manages interface structure and interaction logic.  


## Schematic
<img width="458" height="493" alt="image" src="https://github.com/user-attachments/assets/1405323f-5384-41e8-b098-fb28bc3a9054" />



## Project Interaction

Video interaction: https://drive.google.com/file/d/1h1HtV-_-JUEKgieFiu1-NDM2Pb2Thfwr/view?usp=sharing

p5.js sketch: https://editor.p5js.org/sa8831/sketches/PlkeI1z0w

## Core Features  

1. **Real-Time Hardware Control**  
   - Two potentiometers control horizontal and vertical cursor movement.  
   - Analog values are mapped dynamically to canvas dimensions.

2. **Drawing Toggle System**  
   - Push button toggles drawing mode on and off.  
   - Each toggle generates a new randomized RGB color.

3. **Serial Communication Pipeline**  
   - Arduino sends formatted data (`x,y,buttonState`) via Serial at 115200 baud.  
   - p5.js reads and parses incoming data using WebSerial.

4. **User Interface Flow**  
   - Start screen with tutorial instructions.  
   - Connect / Disconnect serial controls.  
   - Clear canvas and Save as PNG functionality.

5. **Optimized Input Handling**  
   - Debounce logic implemented for stable button detection.  
   - Reduced serial lag by optimizing read frequency.
