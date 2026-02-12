// Arduino sketch for potentiometer-based Etch A Sketch with button toggle
const int potX = A0;
const int potY = A1;
const int buttonPin = 2;

int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 20;

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int xVal = analogRead(potX);
  int yVal = analogRead(potY);

  int reading = digitalRead(buttonPin);
  int btnState = LOW;

  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    btnState = (reading == LOW) ? 1 : 0;  // Pressed = 1
  }

  lastButtonState = reading;

  Serial.print(xVal);
  Serial.print(",");
  Serial.print(yVal);
  Serial.print(",");
  Serial.println(btnState);

  delay(20); // Reduced update rate to prevent buffer overflow
}
