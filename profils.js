// GESTION DES PROFILS DES JOUEURS

// Données des profils
export const profilesData = [
    {
        playerIndex: 0,
        pseudo:"playerone",
        avatarSource:"assets/avatar-singe.png",
        theme:"lavender",
    },
    {
        playerIndex: 1,
        pseudo:"playertwo",
        avatarSource:"sources/avatar-herisson.png",
        theme:"orange",
    }
]


// DONNEES JOUEUR 1
export const avatarOptionsP1 = document.getElementById('p1-avatar-options')
export const themeOptionsP1 = document.getElementById('p1-theme-options')
export const pseudoValueP1 = document.getElementById('p1-pseudo')

let chosenAvatarP1 = document.getElementById('p1-chosen-avatar')
let profileContainerP1 = document.querySelector('.p1-chosen-theme')

addAvatarEventListener(avatarOptionsP1, chosenAvatarP1)
addThemeEventListener(themeOptionsP1, profileContainerP1)


// DONNES JOUEUR 2
export const avatarOptionsP2 = document.getElementById('p2-avatar-options')
export const themeOptionsP2 = document.getElementById('p2-theme-options')
export const pseudoValueP2 = document.getElementById('p2-pseudo')

let chosenAvatarP2 = document.getElementById('p2-chosen-avatar')
let profileContainerP2 = document.querySelector('.p2-chosen-theme')

addAvatarEventListener(avatarOptionsP2, chosenAvatarP2)
addThemeEventListener(themeOptionsP2, profileContainerP2)


// BOUTON SUIVANT 
export const startQuizBtn = document.getElementById("start-quiz-btn")




// PERMET LES CHOIX DES AVATARS
// Fonction qui ajoute aux boutons avatar l'écouteur d'évenement
export function addAvatarEventListener(container, chosenAvatarElement){
    container.addEventListener('click', function (event) {
        if(event.target.tagName === 'IMG'){
            let source = event.target.getAttribute("src")
            let alt = event.target.getAttribute('alt')
            let index = container.dataset.index
            chosePlayerAvatar(index, source, alt, chosenAvatarElement);
        } 
        
    })
}

// Fonction pour choisir l'avatar
function chosePlayerAvatar(index, source, alt, chosenAvatarElement){
    profilesData[index].avatarSource = source;
    chosenAvatarElement.setAttribute("src", source);
    chosenAvatarElement.setAttribute("alt", alt); 
}



// PERMET LE CHOIX DES THEMES
// Fonction qui ajoute aux boutons theme l'écouteur d'évenement
export function addThemeEventListener(container, profileContainer){
    container.addEventListener('click', function (event) {
        if (event.target.classList.contains('theme-option')){
            let index = container.dataset.index
            profilesData[index].theme = event.target.dataset.colors;
            let colorChange = event.target.dataset.gradient;
            chosePlayerTheme(colorChange, profileContainer)
        } 
        
    })
}

//Fonction pour choisir le thème
function chosePlayerTheme(colorChange, profileContainer){
    profileContainer.style.background = colorChange;
}



