module Components.Papers exposing
  ( Model
  , Msg
  , Paper
  , Person
  , Conference
  , Link
  , init
  , update
  , subscriptions
  , view
  )

import Html exposing (..)
import Html.Attributes exposing (..)

import Void


-- MODEL

type Model =
  Model


init : Model
init =
  Model


type alias Paper =
  { title : String
  , authors : List Person
  , conference : Conference
  , link : Maybe Link
  , extra : List (String, Link)
  }


type alias Person =
  { name : String
  , link : Maybe Link
  }


type alias Conference =
  { name : String
  , link : Maybe Link
  , date : String
  }


type alias Link =
  String


-- UPDATE

type alias Msg
  = Void.Void


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  Void.absurd msg


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW

view : List Paper -> Model -> Html Msg
view papers Model =
  div [ class "ui compact items" ]
    ( List.map viewPaper papers )


viewPaper : Paper -> Html msg
viewPaper paper =
  div [class "item"]
    [ div [ class "content" ]
        [ viewWithLink [ class "header" ] paper.title paper.link
        , div [ class "description" ]
            [ div []
                ( List.map viewPerson paper.authors |> List.intersperse (text ", ") )
            , viewConference paper.conference
            ]
        , div [ class "extra" ]
            ( List.map viewExtra paper.extra )
        ]
    ]


viewPerson : Person -> Html msg
viewPerson person =
  viewWithLink [] person.name person.link


viewConference : Conference -> Html msg
viewConference conference =
  span []
    [ viewWithLink [] conference.name conference.link
    , text ", "
    , text conference.date
    ]


viewExtra : (String, Link) -> Html msg
viewExtra (s, link) =
  span []
    [ text "["
    , viewWithLink [] s (Just link)
    , text "]"
    ]


viewWithLink : List (Attribute msg) -> String -> Maybe Link -> Html msg
viewWithLink attr s link =
  case link of
    Nothing ->
      span attr [ text s ]

    Just link' ->
      a (attr ++ [ href link', target "_blank" ]) [ text s ]

