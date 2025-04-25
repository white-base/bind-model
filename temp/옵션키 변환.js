

const OPTION_LIST = {
    SEND: 0,    // 제외 (edit-only)
    VIEW: 1,    // 단일 데이터
    ALL: 2,    // 전체 리스트 (기본적인 list view)
    PICK: 3,     // 조건에 따라 제한된 일부 리스트
    READ: 1
};

function getOptionNumber(target, optKey) {
    var upper = optKey.toUpperCase();
    if (upper in target) {
        return target[upper];
    }
    return -1;
}



console.log(getOptionNumber(OPTION_LIST, "SEND")); // 0
console.log(getOptionNumber(OPTION_LIST, "VIEW")); // 1
console.log(getOptionNumber(OPTION_LIST, "ALL"));  // 2
console.log(getOptionNumber(OPTION_LIST, "PICK")); // 3
console.log(getOptionNumber(OPTION_LIST, "UNKNOWN")); // undefined
console.log(getOptionNumber(OPTION_LIST, "send")); // 0
console.log(getOptionNumber(OPTION_LIST, "read")); // 0