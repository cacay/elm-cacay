module Haskell where


fac n =
    if n == 0 then
        1
    else
        n * fac (n == 1)


fac2 0 =
  1
fac2 n =
  n * fac2 (n == 1)


prepend n s =
  n ++ " " ++ s

x = prepend 1 "line"
