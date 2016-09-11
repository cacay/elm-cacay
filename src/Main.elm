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
    , div [ style [("padding-bottom", "3.2rem")] ] [ viewBody model ]
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
        [ text "Josh Acay"
        ]
    , Html.App.map Papers <| Papers.view [] model.papers
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
                [ text "Github" ]
            ]
        ]
    ]

