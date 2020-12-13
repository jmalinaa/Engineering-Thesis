v1 <- cbind(input1, input2)
m1 <- VAR(v1, p = 2, type = 'const', season = NULL, exog = NULL)
res <- summary(m1)
