import Html exposing (..)
import Html.App
import Html.Attributes exposing (..)

import RouteUrl
import RouteUrl.Builder as Builder
import Navigation exposing (Location)

import Components.Papers as Papers


-- APP

main : Program Never
main =
  RouteUrl.program
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    , delta2url = delta2url
    , location2messages = location2messages
    }


-- MODEL

type alias Model =
  { papers : Papers.Model
  }


init : (Model, Cmd Msg)
init =
  ({ papers = Papers.init }, Cmd.none)


-- UPDATE

type Msg
  = Papers Papers.Msg


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Papers subMsg ->
      let
        (subModel', subCmd) = Papers.update subMsg model.papers
      in
        ( {model | papers = subModel'} , Cmd.map Papers subCmd)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.map Papers (Papers.subscriptions model.papers)


-- ROUTE

delta2url : Model -> Model -> Maybe RouteUrl.UrlChange
delta2url old new =
  Maybe.map Builder.toHashChange <| delta2builder old new


delta2builder : Model -> Model -> Maybe Builder.Builder
delta2builder old new =
  Nothing


location2messages : Location -> List Msg
location2messages loc =
  builder2messages <| Builder.fromHash loc.href


builder2messages : Builder.Builder -> List Msg
builder2messages builder =
  []


-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ viewMenu model
    , div [ style [("padding-bottom", "4.2rem")] ] [ viewBody model ]
    , viewFooter model
    ]


viewMenu : Model -> Html Msg
viewMenu model =
  nav [ class "ui pointing stackable inverted black menu" ]
    [ div [ class "ui container" ]
        [ a [ class "header item", href "/" ]
            [ text "Coşku Acay" ]
        ]
    ]


viewBody : Model -> Html Msg
viewBody model =
  div [ class "ui container" ]
    [ h1 [ class "ui dividing header" ]
        [ text "Josh Acay" ]
    , div [ class "ui stackable grid" ]
        [ div [ class "four wide column" ]
            [ card ]
        , div [ class "twelve wide column" ]
            [ h2 [ class "ui header" ]
                [ text "About Me" ]
            , about
            , h2 [ class "ui header"]
                [ text "Publications" ]
            , div []
                [ Html.App.map Papers <| Papers.view papers model.papers ]
            ]
        ]
    ]


card : Html msg
card =
  div [ class "ui centered card" ]
    [ div [ class "image" ]
        [ img [ src "./images/profile.jpg" ] [] ]
    , div [ class "content" ]
        [ p [ rel "email" ]
            [ text "Email: "
            , a [ href "mailto:mailto:coskuacay@gmail.com", rel "email" ]
                [ text "coskuacay@gmail.com" ]
            ]
        , p [ rel "phone" ]
            [ text "Phone: +1 (412) 580-7442" ]
        ]
    , div [ class "extra content" ]
        [ div [ class "ui equal width grid" ]
            [ div [ class "column" ]
                [ a [ href "https://www.facebook.com/coskuacay"
                    , target "_blank"
                    , title "Facebook"
                    , rel "external me"
                    ]
                    [ i [ class "big facebook icon" ] [] ]
                ]
            , div [ class "center aligned column" ]
                [ a [ href "http://www.linkedin.com/in/cacay"
                    , target "_blank"
                    , title "LinkedIn"
                    , rel "external me"
                    ]
                    [ i [ class "big linkedin icon" ] [] ]
              ]
            , div [ class "right aligned column" ]
                [ a [ href "https://github.com/cacay"
                    , target "_blank"
                    , title "GitHub"
                    , rel "external me"
                    ]
                    [ i [ class "big github icon" ] [] ]
                ]
            ]
        ]
    ]


about : Html msg
about =
  div []
    [ p []
        [ text "I recently graduated from "
        , a [ href "http://www.cmu.edu/", target "_blank" ]
            [ text "Carnegie Mellon University" ]
        , text " and now I work at "
        , a [ href "https://www.whatsapp.com/", target "_blank" ]
            [ text "WhatsApp" ]
        , text "."
        ]
    , p []
        [ text "You can view my resume "
        , a [ href "./papers/resume.pdf", target "_blank" ]
            [ text "here" ]
        , text "."
        ]
    ]


viewFooter : Model -> Html Msg
viewFooter model =
  footer [ class "ui inverted vertical segment" ]
    [ div [ class "ui two column grid container" ]
        [ span [ class "column" ]
            [ text "© 2016 "
            , span [ itemprop "name" ] [ text "Coşku Acay" ]
            ]
        , span [ class "right aligned column" ]
            [ text "View this page on "
            , a [ href "https://github.com/cacay/elm-cacay", target "_blank" ]
                [ text "GitHub" ]
            ]
        ]
    ]


-- PAPERS

papers : List Papers.Paper
papers =
  [ { title = "Intersections and Unions of Session Types"
    , authors = [ acay, pfenning ]
    , conference =
        { name = "Intersection Types and Related Systems"
        , link = Just "http://www-kb.is.s.u-tokyo.ac.jp/ITRS2016/"
        , date = "June 2016"
        }
    , link = Just "./papers/itrs2016.pdf"
    , extra = [ ("Slides", "./papers/itrs2016-slides.pdf") ]
    }
  , { title = "Refinements for Session Typed Concurrency"
    , authors = [ acay, pfenning ]
    , conference =
        { name = "Senior Honors Thesis"
        , link = Nothing
        , date = "May 2016"
        }
    , link = Just "./papers/senior-thesis.pdf"
    , extra =
        [ ("Slides", "./papers/senior-thesis-slides.pdf")
        , ("Poster", "./papers/senior-thesis-poster.pdf")
        ]
    }
  ]

acay : Papers.Person
acay =
  { name = "Coşku Acay"
  , link = Nothing
  }

pfenning : Papers.Person
pfenning =
  { name = "Frank Pfenning"
  , link = Just "http://www.cs.cmu.edu/~fp/"
  }

