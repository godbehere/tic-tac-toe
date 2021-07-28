const mockDocument = (() => ({
    querySelector: (selector) => ({
      innerHTML: null,
    }),
}))();

const gameBoard = (function(){
    let gamePieces = ['O','X','O','X','O','X','O','X','O'];

    //let gamePieces = [];

    const displayPieces = function() {
        console.log(gamePieces);
    }

    return { displayPieces };

})();

const gameplay = (function(doc){
    

    return {  };
})(document || mockDocument);

const player = function(name){
    let playerName = name;
    let score = 0;

    const displayScore = function() {
        console.log(`${playerName} has a score of ${score}`)
    }

    const winGame = function() {
        score += 1;
    }

    return { displayScore, winGame };

};