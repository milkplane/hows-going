// Do not use heap
// isInQueue O(n)
// updateQueue O(n)

type PrioritizedNode<T> = {
    priority: number;
    value: T;
}

const prioritized = <T>(areEqual: (vlaue1: T, value2: T) => boolean) => {
    const queue: PrioritizedNode<T>[] = [];

    const extractHighestPriority = (): T => {
        //typescript moment
        return (queue.pop() as PrioritizedNode<T>).value
    }

    const isInQueue = (value: T) => {
        const index = queue.findIndex((node) => {
            return areEqual(node.value, value);
        });

        return index != -1;
    }

    const addToQueue = (value: T, priority: number) => {
        let i = 0;
        while (i < queue.length && queue[i].priority >= priority) i++;

        queue.splice(i, 0, {
            priority,
            value,
        })
    }

    const updatePriority = (value: T, priority: number) => {
        queue.splice(queue.findIndex((node) => areEqual(node.value, value)), 1);
        addToQueue(value, priority);
    }

    const isQueueEmpty = () => queue.length === 0;


    return { extractHighestPriority, isInQueue, addToQueue, isQueueEmpty, updatePriority };
}

export default prioritized;