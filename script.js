var lst_nodes = [];
var lst_edges = [];
var container = document.getElementById("mynetwork");


function createArray(n) {
      // creates an array with nodes
      
      for (var i=1; i <= n**2; i++)
      {
        lst_nodes.push({ id : i, label: i.toString(), voisins: [], joueur: "sans"});
      }

      //creates an array with edges
      //crée un graphe carré
      if (document.getElementById("case1").checked) {
        for (var j=1; j <= n**2; j++)
        {
          if (j%n != 0) {
            lst_edges.push({from: j, to: j+1});          

          }
         if (j+n <= n**2) {
            lst_edges.push({from: j, to: j+n});
          }
        }
      }

      
      
      //test
      //crée un graphe aléatoire binomial
      if (document.getElementById("case2").checked) {
        for (var i=1; i <= n**2; i++) {
          for (var j=1; j <= n**2; j++) {
            var p = Math.random();          
            if (i!=j && p <= (2/(n**2))) {
              lst_edges.push({from: i, to: j});
            }
          }
        }
      }
      

      // fonction qui génère un entier aléatoire entre min et max
      function entierAleatoire(min, max)
      {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      //autre test 
      //cette boucle parcourt chaque sommets et crée des arrêtes qui partent vers 2 sommets aléatoires 
      //une arrête peut revenir sur son propre sommet
      if (document.getElementById("case3").checked) {
        for (var i=1; i <= n**2; i++) {
          var p = entierAleatoire(1,n**2);
          var q = entierAleatoire(1,n**2);
          lst_edges.push({from: i, to: p});
          lst_edges.push({from: i, to: q});
        }
      }
      
      var nodes = new vis.DataSet(lst_nodes);
      var edges = new vis.DataSet(lst_edges);

      // create a network
      var data = {
        nodes: nodes,
        edges: edges,
      };
      // setting options
      var options = {
        nodes: {
          shape: "dot",
          size: 30,
          font: {
            color: 'whitesmoke',
          },
        },

        edges: {
          length: 1,
          physics: false,
        },

        physics: {
          enabled: true,
        }
      };
      
      var network = new vis.Network(container, data, options);
      network.setOptions(options);

      //function that compares to object by comparing their "stringified" version
      //returns true if they are equal
      function isEqual(obj1, obj2) {
        var array1 = Object.values(obj1);
        var array2 = Object.values(obj2);
        return JSON.stringify(array1.slice(4)) === JSON.stringify(array2);
      }
      
      var counting = 0;
      
      network.on("click", function (params) {
          var nodeID = params.nodes[0];
          var clickedNode = nodes.get(nodeID);
          var blueColor = {
            color: {
                border: '#0000FF',
                background: '#0000FF',
                highlight: {
                  border: '#0000FF',
                  background: '#0000FF'
            }},
          };
          var redColor = {
            color: {
                border: '#FF0000',
                background: '#FF0000',
                highlight: {
                  border: '#FF0000',
                  background: '#FF0000'
            }},
          };
          if (isEqual(clickedNode, blueColor) || isEqual(clickedNode, redColor)) {
            {}
          }
          else {
            if (nodeID) {
              if (counting % 2 == 0) {
                document.getElementById("player").innerText = "Joueur 2 : Bleu";
                clickedNode.color = {
                  border: '#FF0000',
                  background: '#FF0000',
                  highlight: {
                    border: '#FF0000',
                    background: '#FF0000'
                  }
                }
                clickedNode["joueur"] = "Joueur 1 : Rouge";
              }
              else {
                document.getElementById("player").innerText = "Joueur 1 : Rouge";
                clickedNode.color = {
                  border: '#0000FF',
                  background: '#0000FF',
                  highlight: {
                    border: '#0000FF',
                    background: '#0000FF'
                  }
                }
                clickedNode["joueur"] = "Joueur 2 : Bleu";
              }
              nodes.update(clickedNode);
              counting += 1;
            }
          }
        if (counting == n**2) {
          alert('Le jeu est terminé !');
        }
      });

} 

//fonction auxiliere qui permet de crée un graphe selon l'input donnée par les joueurs
function createArrayAux() {
  var size = parseInt(document.getElementById('myRange').value);
  createArray(size);
  createVoisins();  
  while (parcoursLargeur(lst_nodes, lst_nodes[0]) != (size*size)) { //cette boucle permet de n'avoir que des graphes entièrement connectés
    allReset();
    createArray(size);
    createVoisins();
  }
}




//fonction qui permet de tout réinitialiser
function allReset() {
    lst_nodes = [];
    lst_edges = [];
    createArray(0);
    document.getElementById("player").innerText = "Joueur 1 : Rouge";
    document.getElementById("afficheTour").innerText = "Au tour de :";
    resetMarqueurs();
}


//fonction qui crée la liste des voisins de chaque sommet
function createVoisins() {
  for (obj in lst_edges) {
    var arrayObj = Object.values(lst_edges[obj]);
    var i1 = parseInt(arrayObj[0]);
    var i2 = parseInt(arrayObj[1]);
    lst_nodes[i1-1]["voisins"].push(lst_nodes[i2-1]); //ajoute le sommet i2 à la liste des voisins du sommet i1
    lst_nodes[i2-1]["voisins"].push(lst_nodes[i1-1]); //ajoute le sommet i1 à la liste des voisins du sommet i2 
  }
}


//fonction qui renvoie vrai si les 2 sommets entrés en argument ont la même couleur
function sameColor(node1, node2) {
  var color1 = node1["color"];
  var color2 = node2["color"];
  return JSON.stringify(color1) === JSON.stringify(color2);
}


//fonction qui parcourt en largeur à partir d'un sommet node, et d'une liste de sommets nodes_lst, renvoie la longueur du sous graphe connexe
function parcoursLargeur(nodes_lst, node) {
  var compteur = 0;
  var file = [];                                      // f = créerFile();
  file.push(node);                                    // f.enfiler(node);
  node["marqueur"] = true;                            //marquer(node);
  var compteur = 1;
  while (!(file === undefined || file.length == 0)) {               //tant que la file est non vide 
    node2 = file.shift();                                         //node2 = f.defiler(); ?
    if (typeof node2 !== 'undefined') {
      for (neighbors in node2["voisins"]) {                     //pour tout voisin node2["voisins"][neighbors] de node2 dans G
        if (sameColor(node, node2["voisins"][neighbors])) {     //permet de ne visiter que les voisins de même couleur
          if (!node2["voisins"][neighbors]["marqueur"]) {       //si t non marqué
            file.push(node2["voisins"][neighbors]);             //f.enfiler(t);
            node2["voisins"][neighbors]["marqueur"] = true;     //marquer(t);
            compteur+=1;
          }
        }
      }
    }
  }
  return compteur;
}


//fonction qui "enleve" les marqueurs de tous les sommets
function resetMarqueurs () {
  for (i in lst_nodes) {
    lst_nodes[i]["marqueur"] = false;
  }
}

//fonction qui affiche le gagnant
function whoWins() {
  var listeOrdreSsG = [];
  var couleur = [];
  for (i in lst_nodes) {
    listeOrdreSsG.push(parcoursLargeur(lst_nodes, lst_nodes[i]));
    resetMarqueurs();
  }
  let indiceWin = listeOrdreSsG.indexOf(Math.max(...listeOrdreSsG));
  let ordreWin = Math.max(...listeOrdreSsG);
  document.getElementById("player").innerText = "";
  document.getElementById("afficheTour").innerText = lst_nodes[indiceWin]["joueur"]+ ", ordre : " + ordreWin;
}

function estConnexe(size) {
  var ordre = parcoursLargeur(lst_nodes, lst_nodes[0]);
  return ordre == (size*size);
}





