type GameOptions = {
    secretWord: string;
    trials: number
}

export enum GameResult {
    PlayerWins = "FELICIDADES HAZ GANADO",
    PlayerLoses = "LO SIENTO; HAZ PERDIDO",
    Ongoing = "SIGUE INTENTANDO",
    CorrectLetter = "LETRA CORRECTA; SIGUE ASI"
};

export enum GameError {
    TrialsMustBePositive = "LA CANTIDAD DE INTENTOS DEBE SER POSITIVA",
    SecretWordMustHaveAtLeastOneLetter = "LA PALABRA SECRETA DEBE TENER AL MENOS UNA LETRA",
    MultipleLettersNotAllowed = "NO SE PUEDEN INTRODUCIR MULTIPLES LETRAS",
    InvalidCharacter = "CARACTER INVALIDO, DEBE DE SER UNA LETRA"
}
export class Guess {

    public letter (value: string): string {
        if (value.length > 1) {
            return "";
        }

        return value;
    }
}

export class Game {
    private word: string;
    private trials: number;
    private trialsAcount: number;
    private isCorrctWord: boolean;
    private trialsWord: string[];
    private error: string;

    constructor(wordValue: string, trials: number ) {
        this.word = wordValue || '';
        this.trials = trials || 0;
        this.trialsAcount = 0;
        this.isCorrctWord = false;
        this.trialsWord = Array.from(Array(this.word.length), () => '_');
        this.error = "";
        this.validateAndSetError();
    }

    public tryTo (letter: string): Game {
        if (!letter) {
            this.error = GameError.MultipleLettersNotAllowed;
            this.isCorrctWord = false;
        } else if (!this.validateLetter(letter)) {
            this.error = GameError.InvalidCharacter;
            this.isCorrctWord = false;
        } else {
            this.error = "";
            this.trialsAcount = this.trialsAcount + 1;

            const indexLetter = this.word.indexOf(letter);
            this.isCorrctWord = indexLetter >= 0;
            if (this.isCorrctWord) {
                this.trialsWord[indexLetter] = letter;
            }
        }

        return this;
    }

    public isOver (): boolean {
        if (!this.word) {
            return true;
        }

        if (this.revealedSecret() === this.word) {
            return true;
        }

        return this.trialsAcount >= this.trials;
    }

    public result (): string {
        if (this.isCorrctWord) {
            return this.isOver() ? GameResult.PlayerWins : GameResult.CorrectLetter;
        }

        return this.isOver() ? GameResult.PlayerLoses : GameResult.Ongoing;
    }

    public availableTrials (): number {
        if (this.isOver()) {
            return 0;
        }

        return this.trials - this.trialsAcount;
    }

    public revealedSecret (): string {
        return this.trialsWord.join('');
    }

    public isMisconfigured(): boolean {
        return !this.word || this.trials <= 0;
    }

    public problem(): string {
       return this.error;
    }

    private validateAndSetError (): void {
        if (!this.word) {
            this.error = GameError.SecretWordMustHaveAtLeastOneLetter;
        }

        if (this.trials <= 0) {
            this.error = GameError.TrialsMustBePositive;
        }
    }

    private validateLetter (letter: string): boolean {
        if (!letter) {
            return false;
        }

        return isNaN(Number(letter));
    }
}
export class Hangman {
    public startGame (options: GameOptions): Game {
        return new Game(options.secretWord, options.trials);
    }
}