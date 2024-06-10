// questions.js : questions possibles du quiz et profils.js : pseudo, avatar, theme de chaque joueur
import {questions, randomQuestionsSelection} from './questions.js'
import { profilesData, pseudoValueP1, pseudoValueP2, startQuizBtn} from './profils.js';

// Toutes les constantes du quiz
const gameState = document.getElementById("state");
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-question-btn');
const profilesEditor = document.getElementById('edit-profiles')
const quiz= document.getElementById('quiz-game')
const currentPlayerAvatar = document.getElementById('current-player-avatar')
const currentPlayerAvatarPopup = document.getElementById('avatar-img-popup')
const popup = document.getElementById('popup-info')
const currentPlayerPseudo = document.getElementById('player-pseudo')
const okButtonPopup= document.getElementById('ok-btn')
const popupGameStateText = document.getElementById('popup-game-state')
const popupQuizInstructions= document.getElementById('popup-instructions')
const popupImages= document.getElementById('popup-images')

const resultsAvatarsContainerP1= document.getElementById('results-avatar-p1')
const resultsAvatarsContainerP2= document.getElementById('results-avatar-p2')
const quizCorrection = document.getElementById('quiz-correction')
const result = document.getElementById('result')
const resultQuote= document.getElementById('still-friends-answer')

const quizResultsView = document.getElementById('quiz-results')
const quizQuestionsView = document.getElementById('quiz')

// Variables du jeu
let currentQuestionIndex = 0; 
let correctionArray=[];
let currentPlayer = 0;

// Constructor données du quiz
function QuizzData (a){
    this.idQuestion = a;
}


// Gestionnaires d'événements nommés
okButtonPopup.addEventListener('click', closePopup)
startQuizBtn.addEventListener("click", startQuiz)
nextButton.addEventListener('click', handleNextButton)





// TOUTES LES FONCTIONS 

// FONCTIONS DE GESTION DU POPUP
function closePopup() {
    popup.style.display = "none";
}

function setPopupText(situation){
    popupGameStateText.innerHTML = situation[0]
    popupQuizInstructions.innerHTML = situation[1]
}

const popupPossibleText ={
    playerOne : ["C'est ton tour !",'Réponds à chaque question par la réponse qui te ressemble le plus.'],
    playerTwo : ["À toi de jouer !", 'Essaye de deviner les réponses.'],
    endQuiz : ["C'est terminé !", `Voyons à quel point 
    vous vous connaissez !`]
}

function showWhoseTurnPopup(){
    popup.style.display="flex";
    currentPlayerPseudo.innerHTML= profilesData[currentPlayer].pseudo
    if(currentPlayer === 0){
        setPopupText(popupPossibleText.playerOne)
    } else {
        setPopupText(popupPossibleText.playerTwo)
    }
}

function showEndQuizPopup(){
    popup.style.display="flex";
    setPopupText(popupPossibleText.endQuiz)

    while(popupImages.firstChild){
        popupImages.removeChild(popupImages.firstChild);
    }
}





// FONCTION QUI GERE LES CHANGEMENTS DE PROFIL ENTRE LES JOUEURS
// function qui switch à l'avatar du joueur actuel
function switchToCurrentPlayerAvatar(currentPlayerIndex, container){
    container.setAttribute('src', profilesData[currentPlayerIndex].avatarSource)
} 

// fonction qui passe au thème du joueur 2
function switchToCurrentPlayerProfile(){
    if (currentPlayer === 0){
        document.body.classList.toggle(profilesData[currentPlayer].theme);
    } else {
        document.body.classList.remove(profilesData[currentPlayer-1].theme)
        document.body.classList.add(profilesData[currentPlayer].theme);
    }
    switchToCurrentPlayerAvatar(currentPlayer, currentPlayerAvatar) 
    switchToCurrentPlayerAvatar(currentPlayer, currentPlayerAvatarPopup)   
}




// FONCTIONS QUI AFFICHE LES QUESTIONS
// fonction pour démarrer le quiz
function startQuiz(){
    if(pseudoValueP1.value && pseudoValueP2.value){ 
        profilesData[0].pseudo = pseudoValueP1.value
        profilesData[1].pseudo = pseudoValueP2.value
        switchToQuizView()
        } else {
            alert("Merci de renseigner les pseudos.")
        }
}

// fonction pour passer à la vue quiz
function switchToQuizView(){
    profilesEditor.style.display="none"
    quiz.style.display ="block"

    switchToCurrentPlayerProfile()
    showWhoseTurnPopup()
    displayQuestions()
}

// fonction pour afficher les questions du quiz
function displayQuestions(){
    resetState()
    const currentQuestion = questions[randomQuestionsSelection[currentQuestionIndex]];
    questionElement.innerHTML = currentQuestion.question;

    recordCurrentQuestion()
    currentPlayerGameState()
    
    currentQuestion.answers.forEach(answer => {
        const button = createAnswerButton(answer.text, answer.idAnswer)
        answerButtons.appendChild(button);
        button.addEventListener('click', selectAnswer);
    })
}

// fonction pour reinitialiser l'état des boutons de réponse
function resetState(){
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// fonction pour enregistrer la question actuelle
function recordCurrentQuestion(){
    if (currentPlayer === 0){
        let myObject = new QuizzData(questions[randomQuestionsSelection[currentQuestionIndex]].idQuestion)
        correctionArray.push(myObject)
        } 
}

// fonction qui adapte la phrase d'instruction du quiz au joueur
function currentPlayerGameState(){
    if(currentPlayer === 0){
        gameState.innerHTML =`<span class="bold">${profilesData[0].pseudo}</span> réponds aux questions. (${currentQuestionIndex+1}/7)`;
        } else {
            gameState.innerHTML =`<span class="bold">${profilesData[1].pseudo}</span> essaye de deviner les réponses de <span class="bold">${profilesData[0].pseudo}</span>. (${currentQuestionIndex+1}/7)`;
        }
}

// fonction qui créer un bouton de réponse
function createAnswerButton(text, id){
    const button = document.createElement("button");
    button.innerHTML = text;
    button.classList.add("answer-btn");
    button.dataset.idAnswer = id;
    return button;
}



// FONCTIONS QUI GERE LES REPONSES
// fonction pour sélectionner une réponse
function selectAnswer(e){
    const selectedBtn = e.target;
    const prevSelectedButton = document.querySelector('.selected');

    // Déselectionne la réponse précédente (le cas échéant)
    if(prevSelectedButton){
        prevSelectedButton.classList.remove('selected')
    }

    // Mettre en surbrillance la réponse 
    selectedBtn.classList.add("selected");

    recordSelectedAnswer(selectedBtn.dataset.idAnswer)    
}


// fonction pour enregistrer la réponse sélectionnée
function recordSelectedAnswer(answer){
    if(currentPlayer === 0 ){
        correctionArray[currentQuestionIndex].idAnswerPlayerOne = answer;
    } else {
        correctionArray[currentQuestionIndex].idAnswerPlayerTwo = answer; 
    }
}

// fonction pour gérer le clic sur bouton suivant
function handleNextButton(){
    // Vérifie si une réponse a bien été séléctionnée 
    if (document.querySelector('.selected')) {
        currentQuestionIndex++;
        
        // Affiche la prochaine question ou termine le quiz
        if (currentQuestionIndex < randomQuestionsSelection.length) {
            displayQuestions()
        } else {
            handleEndQuiz() 
        }
    } else {
        alert('Réponse nécessaire')
    }  
}



// FONCTIONS QUI GERE LA FIN DES QUIZ
// fonction pour terminer le quiz ou lancer celui du joueur2
function handleEndQuiz(){
    if (currentPlayer === 0 ){
        currentPlayer++
        currentQuestionIndex = 0;

        showWhoseTurnPopup()
        switchToCurrentPlayerProfile()
        
        displayQuestions();

    } else {
        showEndQuizPopup()
        switchToResultsView()
        displayResults()
    }
}

// fonction qui switch à la vue résultats du quiz
function switchToResultsView(){
    quizQuestionsView.style.display ="none";
    quizResultsView.style.display="flex";
    
}

// fonction qui affiche le résultat final
function displayResults(){
    switchToCurrentPlayerAvatar(0, resultsAvatarsContainerP1.firstElementChild)
    switchToCurrentPlayerAvatar(1, resultsAvatarsContainerP2.firstElementChild)
    
    const correctAnswersCount = calculateCorrectAnswersCount()
    result.innerHTML = `${correctAnswersCount}%`

    if(0<=correctAnswersCount && correctAnswersCount<20){
        resultQuote.innerHTML='Plus maintenant !'
    } else if (20<=correctAnswersCount && correctAnswersCount<50){
        resultQuote.innerHTML="Une discussion s'impose !"
    } else if(50<=correctAnswersCount && correctAnswersCount<80){
        resultQuote.innerHTML= "Une amitié saine! Chacun son Jardin."
    } else {
        resultQuote.innerHTML='Best friends!'
    }

    for (const element of correctionArray){
    let questionCorrection = questions[element.idQuestion].shorterQuestion
    let answerPlayerOne = questions[element.idQuestion].answers[element.idAnswerPlayerOne-1].text
    let answerPlayerTwo = questions[element.idQuestion].answers[element.idAnswerPlayerTwo-1].text
    if(element.correction=== true) {
    quizCorrection.innerHTML += `${questionCorrection} <span class='bold green'>${answerPlayerTwo}</span>`+ '<br>';
    } else{
        quizCorrection.innerHTML += `${questionCorrection} <span class='bold red'>${answerPlayerTwo}</span> | ${answerPlayerOne}`+ '<br>';
    }
    }    
}

// fonction qui calcule le résultat final
function calculateCorrectAnswersCount(){
    let correctAnswersCount = 0;
    let numberOfQuestion = correctionArray.length;
    for (const element of correctionArray){
            if(element.idAnswerPlayerOne === element.idAnswerPlayerTwo){
                correctAnswersCount ++
                element.correction = true
            } else {
                element.correction = false
            }
        }
    let resultatFormate = ((correctAnswersCount / numberOfQuestion ) * 100).toFixed(0);
    return resultatFormate
}




// FONCTION QUI INITIALISE LE QUIZ
function startAll(){
    quiz.style.display ="none"
    profilesEditor.style.display ='flex'
}

startAll()
