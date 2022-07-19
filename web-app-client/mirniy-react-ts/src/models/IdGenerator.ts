


export class IdGenerator {
    private currentId = 1

    constructor(ids?: number[]) {
        if (ids) this.addExistingIds(ids)
    }

    addExistingIds(ids: number[]){
        this.currentId = Math.max(this.currentId-1, ...ids)+1
    }

    getId = () => this.currentId++
}
