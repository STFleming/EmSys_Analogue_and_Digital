const int asig_in = 34;
int asig_val = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  // put your main code here, to run repeatedly:
  asig_val = analogRead(asig_in);
  Serial.println(asig_val);
}
