//定义队列
function Queue(){
    this.dataStore = [];
    this.enqueue = enqueue;     //入队
    this.dequeue = dequeue;     //出队
    this.front = front;         //查看队首元素
    this.back = back;           //查看队尾元素
    this.showQueue = showQueue;   //显示队列所有元素
    this.clearQueue = clearQueue;         //清空当前队列
    this.empty = empty;         //判断当前队列是否为空
    this.QueueNum = QueueNum;
    this.traverse = traverse;
}
//向队列末尾添加一个元素
function enqueue ( element ) {
    this.dataStore.push( element );
}
//删除队列首的元素,并返回
function dequeue () {
    if( this.empty() ) return 'This queue is empty';
    else this.dataStore.shift();
}
//判断队列是否为空
function empty(){
    if( this.dataStore.length == 0 ) return true;
    else return false;
}
//返回队列的元素个数
function QueueNum(){
    return this.dataStore.length
}
//遍历Queue
function traverse(){
    for(let i = 0 ;i < this.dataStore.length;i++ ){
        return dataStore[i]
    }
}
//查看队首元素
function front(){
    if( this.empty() ) return 'This queue is empty';
    else return this.dataStore[0];
}
//查看队尾元素
function back () {
    if( this.empty() ) return 'This queue is empty';
    else return this.dataStore[ this.dataStore.length - 1 ];
}
//查看队列所有元素
function showQueue(){
    return this.dataStore.join('\n');
}
//清空当前队列
function clearQueue(){
    delete this.dataStore;
    this.dataStor = [];
}