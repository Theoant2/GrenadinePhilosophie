const Discord = require('discord.js')
const bot = new Discord.Client({autoReconnect:true})
var fs = require('fs');
var config = {
  prefix: ".."
}
var CHEMINS = {
  QUESTION: "./questions.json"
}
var ADMINS = ["290097887247859726"/*Welzia*/,
              "153965058173566976"/*Grenadine, drogue des lucides*/];
var QUESTIONS = ["Je suis le BATMAN"]
var json = {
   Questions: []
};
console.log("Démarrage du programme ..");

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function replyErrorInChat(message, errorcode){
  message.reply("Une erreur est survenue, code d'erreur: #" + errorcode +
  "\n Faite passer ce code d'erreur à mon créateur (AnotherFox#0147) ou à un administrateur")
}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
function consoleCommande(author, commande, args){
  console.log("[Commande] L'utilisateur " + author.username + " execute la commande '" + commande + "' avec les arguments suivants: " + ((args.toString() == "") ? "Aucun" : args.toString()))
}

function reloadQuestionsFile(send){
  try{
    fs.readFile(CHEMINS.QUESTION, 'utf8', function readFileCallback(err, data){
      if (err){
        console.log(err);
      } else {
        try{
          json = JSON.parse(data); //now it an object
          QUESTIONS = json.Questions;
          send(true)
        } catch (e) {
          console.log(e)
          send(false)
        }
      }
    });
  } catch (e) {
    console.log(e)
  }
}

function writeQuestionsFile(question, bool){
  try{
    json.Questions.push([question, bool]);
    var sendjson = JSON.stringify(json); //convert it back to json
    fs.writeFile(CHEMINS.QUESTION, sendjson, 'utf8', function(err) {
      if(err) console.log(err)
    }); // write it back
  } catch (e) {
    console.log(e)
  }
}

function modifyQuestionsFile(question, bool){
  try{
    console.log(json.Questions);
    for(let i = 0; i < json.Questions.length; i++){
      if(json.Questions[i][0] === question){
        console.log("Trouvé");
        json.Questions[i][1] = bool;
        console.log(json.Questions[i][1]);
      }
    }
    var sendjson = JSON.stringify(json); //convert it back to json
    fs.writeFile(CHEMINS.QUESTION, sendjson, 'utf8', function(err) {
      if(err) console.log(err)
    }); // write it back
  } catch (e) {
    console.log(e)
  }
}

bot.on('ready', function () {
    console.log("Configuration du robot ..")
    bot.user.setPresence({ game: { name: '..philo', type: 0 } })
    console.log("Configuration du robot [OK]")
    console.log("Début de la preparation des tableaux et variables ..")
    let guilds = Array.from(bot.guilds)
    //console.log(Array.from(guilds)[0])

    console.log("Début de la preparation des tableaux et variables [OK]")
    console.log("Je suis actuellement disponnible sur " + bot.guilds.size + " serveur(s)")
    console.log(bot.user.username + " pret !")
    reloadQuestionsFile((bool) => {
      console.log("Chargement des questions " + bool);
    })
})
bot.on('message', message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const argsCommand = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = argsCommand.shift().toLowerCase();
  consoleCommande(message.author, command, argsCommand)
  switch(command){
    case "philo":
      /******************************
Vérification si l'utilisateur est un administrateur du robot
      ******************************/
      if(!(ADMINS.includes(message.author.id))){
        let embed = new Discord.RichEmbed().
        setTitle("[**/!\\**] Vous ne faite pas partie des administrateurs du robot :C [**/!\\**]")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0xff0000);
        message.channel.send({embed})
        return;
      }
      /******************************
            Commande: reload
  Rechargement du fichier "./questions.json"
      ******************************/
      if(argsCommand[0] === "reload"){
        reloadQuestionsFile((bool) => {
          if(bool){
            let embed = new Discord.RichEmbed().
            setTitle("[**°**] Rechargement des questions OK ! [**°**]")
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setColor(0x7cff00);
            message.channel.send({embed})
          } else {
            let embed = new Discord.RichEmbed().
            setTitle("[**/!\\**] Erreur au rechargement des questions :C [**/!\\**]")
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setColor(0xff0000);
            message.channel.send({embed})
          }
        });
        return
      }
      /******************************
            Commande: add
Ajouter une question dans le fichier "./questions.json"
      ******************************/
      if(argsCommand[0] === "add"){
        let new_question = ""
        for(let i = 1; i < argsCommand.length; i++){
          new_question+=argsCommand[i]
          new_question+=" "
        }
        writeQuestionsFile(new_question, false);
        let embed = new Discord.RichEmbed().
        setTitle("[**°**] Questions ajouté OK ! [**°**]")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0x7cff00)
        .setDescription("\n" + "[°] **La question ajouté est:** [°]\n\n" +
        new_question)
        message.channel.send({embed})
        return
      }
      /******************************
            Commande: liste
  Afficher les questions du fichier "./questions.json"
      ******************************/
      if(argsCommand[0] === "liste"){
        let liste = ""
        for(let i = 0; i < json.Questions.length; i++){
          liste+=(json.Questions[i][1] ? "**VRAI**" : "**FAUX**") + ": " + json.Questions[i][0];
          liste+="\n";
        }
        let embed = new Discord.RichEmbed().
        setTitle("[**°**] Liste des questions [**°**]")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0x7cff00)
        .setDescription("\n" + "[°] **Voici la liste des questions:** [°]\n" +
        "(**VRAI**: Déjà utilisé | **FAUX**: Pas encore utilisé)\n\n"+
        liste)
        message.channel.send({embed})
        return
      }
      /******************************
            Commande: help | aide
  Afficher les commandes disponnible du robot
      ******************************/
      if(argsCommand[0] === "help" || argsCommand[0] === "aide"){
        let embed = new Discord.RichEmbed().
        setTitle("[**°**] Liste des commandes [**°**]")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0x7cff00)
        .setDescription("\n" + "[°] **Voici la liste des commandes:** [°]\n\n" +
        "``" + config.prefix + "philo help|aide`` Afficher cette liste\n"+
        "``" + config.prefix + "philo add`` Ajouter une question\n"+
        "``" + config.prefix + "philo liste`` Afficher la liste des questions\n"+
        "``" + config.prefix + "philo`` Générer une question\n");
        message.channel.send({embed})
        return
      }
      /******************************
   Sinon on affiche une nouvelle question
      ******************************/
      let random = getRandomInteger(0,QUESTIONS.length);
      let test = false;
      QUESTIONS.forEach((question) => {
        if(!question[1]){
          test=true;
        }
      });
      if(!test){
        let embed = new Discord.RichEmbed().
        setTitle("[**°**] Il n'y a plus de questions disponnible ! [**°**]")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(0xff0000);
        message.channel.send({embed})
        return
      }
      while(QUESTIONS[random][1]){
        random = getRandomInteger(0,QUESTIONS.length);
      }
      let question = QUESTIONS[random][0];
      let embed = new Discord.RichEmbed().
      setTitle("[**°**] Nouveau débat [**°**]")
      .setAuthor(bot.user.username, bot.user.avatarURL)
      .setColor(0x7cff00)
      .setDescription("\n" + "[°] **La question de ce soir est:** [°]\n\n" +
      question + "\n\n" +
      "Bon débat (**°** 3 **°**)/")
      message.channel.send({embed});
      modifyQuestionsFile(question, true);

  }
})




bot.login('NDIzNTY1MjMyOTgwNjIzMzYw.DYsLqA.6gZYuqiF8egCxnSF_AUREuIlS_Y')
