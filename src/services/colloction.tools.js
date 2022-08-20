export function shift(items) {
    console.log(items);

    let leftIndex = 0;
    let rightIndex = items.length - 1;

    for (let i = 0; i < items.length; ++i) {
        while (items[leftIndex] >= 0){
            leftIndex++;
        }

        while (items[rightIndex] <= 0){
            rightIndex--;
        }

        console.log(items[leftIndex] + ' ' + items[rightIndex]);

        if (items[leftIndex] <= 0 && items[rightIndex] > 0) {
            let temp = items[leftIndex];

            items[leftIndex] = items[rightIndex];
            items[rightIndex] = items[temp];
        }

        leftIndex = leftIndex + 1;
        rightIndex = rightIndex - 1;
    }

    console.log(items);

    // hopefully shifted.
    return items;
}