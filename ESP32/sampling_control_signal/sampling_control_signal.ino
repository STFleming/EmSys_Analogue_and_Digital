// The analog pin we are using
const int pwm_pin = 5;

// PWM properties
const int freq = 5000;
const int channel = 0;
const int resolution = 8;

void setup() {

  // configure the PWM
  ledcSetup(channel, freq, resolution);

  // attach the channel to the GPIO to be controlled
  ledcAttachPin(pwm_pin, channel);

  // set the duty cycle
  ledcWrite(channel, 2);

}

void loop() {

  // increase duty cycle
  //for(int dutyCycle = 0; dutyCycle <= 255; dutyCycle++){
  //  ledcWrite(channel, dutyCycle);
  //  delay(5);
  //}

  // decrease duty cycle
  //for(int dutyCycle = 255; dutyCycle >= 0; dutyCycle--){
  //  ledcWrite(channel, dutyCycle);
  //  delay(5);sam
 // }
  
}
