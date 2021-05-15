module mackintosh {
    export class jumpTable {

    }

    export class jumpTableEntry {
        private temp : string;
        private distance : number;

        constructor(temp : string, distance : number) {
            this.temp = temp;
            this.distance = distance;
        }

        public getTemp() {
            return this.temp;
        }

        public setTemp(temp : string) {
            this.temp = temp;
        }

        public getDistance() {
            return this.distance;
        }

        public setDistance(distance : number) {
            this.distance = distance;
        }
    }
}