// pull in desired CSS/SASS files
import 'semantic-ui-less/semantic.less'


// inject bundled Elm app into div#main
import Elm from './Main.elm'
var app = Elm.Main.embed( document.getElementById( 'main' ) )

