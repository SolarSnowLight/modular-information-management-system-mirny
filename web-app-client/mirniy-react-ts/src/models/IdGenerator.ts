


export class IdGenerator {
    private currentId = 1

    addExistingIds(ids: number[]){
        this.currentId = Math.max(this.currentId, ...ids)
    }

    getId = () => this.currentId++
}