
import { describe, it, expect} from "vitest";
//import { GameError, GameResult, Guess, Hangman } from "./Hangman";
import { GameError, GameResult, Guess, Hangman } from "./Hangman";


describe("Hangman machine", () => {
    let wrapper: Hangman;
    let guess: Guess

    function factory () {
        wrapper = new Hangman();
        guess = new Guess();
    }

    function startGame(secretWord: string, trials: number) {
        factory();
        return wrapper.startGame({secretWord, trials})
    }

    it("finishes the game when all trials are consumed", () => {
        let game = startGame("p", 1)
        game = game.tryTo(guess.letter('a'))
        expect(game.isOver()).toBe(true)
    })

    it("keeps playing the game whilst there are trials left", () => {
        let game = startGame("p", 5)
        game = game.tryTo(guess.letter('a'))
        expect(game.isOver()).toBe(false)
    })

    it("finishes the game when the player guesses the secret word", () => {
        let game = startGame("p", 5)
        game = game.tryTo(guess.letter('p'))
        expect(game.isOver()).toBe(true)
    })

    it("knows when the player wins", () => {
        let game = startGame("p", 5)
        game = game.tryTo(guess.letter('p'))
        expect(game.result()).toEqual(GameResult.PlayerWins)
    })

    it("knows when the player loses", () => {
        let game = startGame("p", 1)
        game = game.tryTo(guess.letter('a'))
        expect(game.result()).toEqual(GameResult.PlayerLoses)
    })

    it("knows that the game is ongoing", () => {
        let game = startGame("p", 5)
        game = game.tryTo(guess.letter('a'))
        expect(game.result()).toEqual(GameResult.Ongoing)
    })

    it("counts the number of trials available", () => {
        let game = startGame("p", 5)
        game = game.tryTo(guess.letter('a'))
        expect(game.availableTrials()).toEqual(4)
    })

    it("reveals only the part of the secret that has been guessed", () => {
        let game = startGame("cat", 5)
        expect(game.revealedSecret()).toEqual("___")
        game = game.tryTo(guess.letter('a'))
        expect(game.revealedSecret()).toEqual("_a_")
    })

    it("can't play a game with wrong arguments", () => {
        let game = startGame("cat", -7)
        expect(game.isOver()).toBe(true)
        expect(game.isMisconfigured()).toBe(true)
        expect(game.problem()).toBe(GameError.TrialsMustBePositive)
        expect(game.revealedSecret()).toEqual("___")
        expect(game.availableTrials()).toEqual(0)

        game = startGame("", 15)
        expect(game.isOver()).toBe(true)
        expect(game.problem()).toBe(GameError.SecretWordMustHaveAtLeastOneLetter)
    })

    it("does not alter a game that is already over", () => {
        let game = startGame("cat", 1)
        game = game.tryTo(guess.letter('a'))
        game = game.tryTo(guess.letter('b'))
        game = game.tryTo(guess.letter('c'))
        expect(game.isOver()).toBe(true)
        expect(game.availableTrials()).toEqual(0)
    })

    it("does not allow for words or multiple letters when guessing", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(guess.letter('ca'))
        expect(game.revealedSecret()).toEqual("___")
        expect(game.problem()).toBe(GameError.MultipleLettersNotAllowed)
        expect(game.availableTrials()).toEqual(5)
    })

    it("does not allow for symbols or numbers, just letters a to z", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(guess.letter('1'))
        expect(game.revealedSecret()).toEqual("___")
        expect(game.problem()).toBe(GameError.InvalidCharacter)
        expect(game.availableTrials()).toEqual(5)
    })

    it("allows for the game to continue after an invalid trial", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(guess.letter('1'))
        game = game.tryTo(guess.letter('a'))
        expect(game.revealedSecret()).toEqual("_a_")
        expect(game.availableTrials()).toEqual(4)
    })

    it("test de juego", () => {
        let game = startGame("amigo", 10)
        game = game.tryTo(guess.letter('e'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('a'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('o'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('ig'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('m'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('i'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('1'))
        console.log(game.revealedSecret(), game.problem(), game.result());
        game = game.tryTo(guess.letter('g'))
        console.log(game.revealedSecret(), game.problem(), game.result());
    })
})