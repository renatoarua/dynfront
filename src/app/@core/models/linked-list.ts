
export class LinkedNode<T> {
    private _elem: T;
    public next: LinkedNode<T> | null;

    constructor(elem: T) {
        this._elem = elem;
        this.next = null;
    }

    get elem(): T {
        return this._elem;
    }
}

export class LinkedList<T> {
    private head: LinkedNode<T> | null = null;
    private len = 0;

    public get length() {
        return this.len;
    }

    constructor(headElement?: LinkedNode<T>) {
        this.head = headElement || null;
    }

    public append(elem: T) {
        let node = new LinkedNode(elem);
        let current: LinkedNode<T>;

        if (this.head === null) {
            this.head = node;
        } else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.len++;
    }

    public elementAt(pos: number): T | null {
        if (pos > -1 && pos < this.len && this.head) {
            let current = this.head;
            let previous: LinkedNode<T> = current;
            let index = 0;

            if (pos === 0) {
                return this.head.elem;
            } else {
                while (index++ < pos && current.next) {
                    previous = current;
                    current = current.next;
                }
            }

            return current.elem;
        } else {
            return null;
        }
    }

    public removeAt(pos: number): LinkedNode<T> | null {
        if (pos > -1 && pos < this.len && this.head) {
            let current = this.head;
            let previous: LinkedNode<T> = current;
            let index = 0;

            if (pos === 0) {
                this.head = current.next;
            } else {
                while (index++ < pos && current.next) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.len--;
            return current;
        } else {
            return null;
        }
    }

    public insert(elem: T, pos: number) {
        if (pos > -1 && pos < this.len && this.head) {
            let current = this.head;
            let index = 0;
            let previous = current;
            let node = new LinkedNode(elem);

            if (pos == 0) {
                node.next = current;
                this.head = node;
            } else {
                while (index++ < pos && current.next) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.len++;
            return true;
        } else {
            return false;
        }
    }

    public toArray() {
        var arr = [];
        var current = this.head;

        while (true) {
            arr.push(current.elem);

            if (current.next) {
                current = current.next;
            } else {
                break;
            }
        }

        return arr;
    }
}