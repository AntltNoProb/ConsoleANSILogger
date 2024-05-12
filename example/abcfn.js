const INFINITE_GREENYELLOW_BUBBLE = `[255D[1C[0;1;33m▄▄▄▄▄▄▄▄▄   ▄▄▄▄   ▄▄▄▄ ▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄   ▄▄▄▄[6C▄▄▄▄▄▄▄▄▄ 
 [42m▓[8C[40m▀▄ [42m▓[2C▓[3C▓[2C▓[1C▓[8C[40m▀▄ [42m▓[8C[40m▀▄ [42m▓[2C▓[6C▓[7C▓[40m 
 [42m▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[1C[30;47m▓[1C[33;42m▒[2C▒[1C▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[1C[30;40m██[47m▓░[1C[33;42m▒[2C[40m█▀▀▀▀▀ 
 [42m░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;33;42m░[1C[30;40m█ [33;42m░[0m░ [1;33;42m░[1C░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;33;42m░[1C[30;40m███[47m▓[1C[33;42m░[0m░ [1;32m▀▀▀▀[33;42m░[40m  
 [32;42m░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[1;32;42m░[1C[30;40m█ [32;42m░[0m▒░[1;32;42m░[1C░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[1;32;42m░[1C[30;40m████ [32;42m░[0m▒░[32m▄▄▄▄█  
 [1;42m▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄▄▄ [1;42m▒[0m▓▒[1;32;42m▒[0;32m▄▄▄▄▄ 
 [1;42m▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░░▒▓█▓[1;32;42m▓[1C▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░   [1;32;42m▓[1C▓[0m█▓▒░   [1;32;42m▓[40m 
 ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀ [0m
`;
/*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
const INFINITE_GREENYELLOW_BUBBLE_PADDING = `[255D[11C [1C[0;1;33m▄▄▄▄▄▄▄▄▄   ▄▄▄▄   ▄▄▄▄ ▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄   ▄▄▄▄[6C▄▄▄▄▄▄▄▄▄ [14C
[11C  [42m▓[8C[40m▀▄ [42m▓[2C▓[3C▓[2C▓[1C▓[8C[40m▀▄ [42m▓[8C[40m▀▄ [42m▓[2C▓[6C▓[7C▓[40m [14C
[11C  [42m▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[1C[30;47m▓[1C[33;42m▒[2C▒[1C▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[40m▀▀▀[42m▒[2C▒[1C▒[2C▒[1C[30;40m██[47m▓░[1C[33;42m▒[2C[40m█▀▀▀▀▀ [14C
[11C  [42m░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;33;42m░[1C[30;40m█ [33;42m░[0m░ [1;33;42m░[1C░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;32m▀▀▀▀▀[0m░[1;32m▄▀ [33;42m░[0m░ [1;33;42m░[1C[30;40m███[47m▓[1C[33;42m░[0m░ [1;32m▀▀▀▀[33;42m░[40m  [14C
[11C  [32;42m░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[1;32;42m░[1C[30;40m█ [32;42m░[0m▒░[1;32;42m░[1C░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[32m▄▄▄▄▄[37m▒[1;32;47m▀[40m▄ [42m░[0m▒░[1;32;42m░[1C[30;40m████ [32;42m░[0m▒░[32m▄▄▄▄█  [14C
[11C  [1;42m▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄[1;42m▒[0m▓▒[1;32;42m▒[1C▒[0m▓▒[1;32;42m▒[0;32m▄▄▄▄▄ [1;42m▒[0m▓▒[1;32;42m▒[0;32m▄▄▄▄▄ [14C
[11C  [1;42m▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░░▒▓█▓[1;32;42m▓[1C▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░░▒▓█[1;32;47m▄[40m▀ [42m▓[0m█▓▒░   [1;32;42m▓[1C▓[0m█▓▒░   [1;32;42m▓[40m [14C
[11C  ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀ [0m[14C
`;
