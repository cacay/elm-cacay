type move = int

let f (lst : move list): (float * float) list =
  let rec loop lst x y dir acc =
    if lst = [] then
      acc
    else
      print_string "foo"
  in
    List.rev ( loop lst 0.0 0.0 0.0 [(0.0,0.0)] )
