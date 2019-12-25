class Promise {
    constructor(excutor) {
        if (typeof excutor !== "function") {
            throw new TypeError(`Promise resolver ${excutor} is not a function`);
        }
        this.initValue();
        this.initBind();
        try {
            excutor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }
    }
    initValue() {
        this.value = null;
        this.reason = null;
        this.state = Promise.PENDING;
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []
    }
    initBind() {
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }
    resolve(value) {
        if (this.state === Promise.PENDING) {
            this.state = Promise.FULFILLED;
            this.value = value;
            this.onFulfilledCallbacks.forEach(fn => fn(this.value))
        }
    }
    reject(reason) {
        if (this.state === Promise.PENDING) {
            this.state = Promise.REJECTED;
            this.reason = reason;
            this.onRejectedCallbacks.forEach(fn => fn(this.reason))
        }
    }
    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = function (value) {
                return value
            }
        }
        if (typeof onRejected !== 'function') {
            onRejected = function (reason) {
                throw reason
            }
        }

        let promise2 = new Promise((resolve, reject) => {
            if (this.state === Promise.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolve(x)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.state === Promise.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolve(x)
                    } catch (e) {
                        reject(e)
                    }

                })
            }
            if (this.state === Promise.PENDING) {
                this.onFulfilledCallbacks.push(value => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(value)
                            resolve(x)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
                this.onRejectedCallbacks.push(reason => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(reason)
                            resolve(x)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        })
        return promise2
    }
}
Promise.PENDING = 'pending'
Promise.REJECTED = 'rejected'
Promise.FULFILLED = 'fulfilled'
Promise.resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) {
        reject(new TypFeError('Chaining cycle detected for promise'))
    }
    let called = false;
    if (x instanceof Promise) {
        x.then(value => {
            resolve(value)
            Promise.resolvePromise(promise2, value, resolve, reject)
        }, reason => {
            reject(reason)
        })

    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            if (typeof x.then === 'function') {
                x.then(value => {
                    if (called) return
                    called = true
                    Promise.resolvePromise(promise2, value, resolve, reject)
                }, reason => {
                    if (called) return
                    called = true
                    reject(reason)
                })
            } else {
                if (called) return
                called = true
                resolve(x)
            }

        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

module.exports = Promise;