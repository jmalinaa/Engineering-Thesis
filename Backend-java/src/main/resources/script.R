require(tseries)
require(vars)

p <- 0.05
s1 <- adf.test(input1)
s2 <- adf.test(input2)

if(s1["p_value"] < p && s2["p_value"] < p ) {
  v1 <- cbind(input1, input2)
  m1 <- VAR(v1, p = 2, type = 'const', season = NULL, exog = NULL)
  res <- summary(m1)
} else {
  input1_differenced <- diff(input1)
  input2_differenced <- diff(input2)
  v1 <- cbind(input1_differenced, input2_differenced)
  m1 <- VAR(v1, p = 2, type = 'const', season = NULL, exog = NULL)
  res <- summary(m1)
}


