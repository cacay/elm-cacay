module Components.Papers exposing
  ( Model
  , Paper (..)
  , Msg
  , init
  , update
  , subscriptions
  , view
  )

import Html exposing (..)
import Html.Attributes exposing (..)

import String
import Void


-- MODEL

type Model =
  Model


type Paper =
  Paper


init : Model
init =
  Model


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
  div []
    []


