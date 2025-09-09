#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ALGORITHM AND LOGICAL UNIT [DEALS WITH 8-bit NUMBERS] */
/* operator_type: 1 = arithmetic, 0 = logical (bitwise) */

struct ALU_8_BIT {
    int operand_one;
    int operand_two;
    int operator_type;
    char operator[6];
};

/* FOR DIRECT ADDRESSING MODE */
struct INSTRUCTION_REGISTER_DAM {
    char alu_opcode[6];
    int operand_one;
    int operand_two;
};

/* FOR REGISTER ADDRESSING MODE */
struct INSTRUCTION_REGISTER_RAM {
    char alu_opcode[6];
    char operand_one[6];
    char operand_two[6];
};

/* INSTRUCTION REGISTER FOR AN 8-bit CPU RAM*/
struct INSTRUCTION_REGISTER_1 {
    int address;
    struct INSTRUCTION_REGISTER_RAM IRM;
};

/* INSTRUCTION REGISTER FOR AN 8-bit CPU DAM*/
struct INSTRUCTION_REGISTER_2 {
    int address;
    struct INSTRUCTION_REGISTER_DAM IRD;
};

/* MAIN MEMORY */
int memory[256] = {0};

/* CHARACTER REGISTERS (store small ints / chars) */
char Rc_0 = 0, Rc_1 = 0, Rc_2 = 0;

/* NUMERIC REGISTERS */
int Ri_0 = 0, Ri_1 = 0, Ri_2 = 0;

/* ALU computation */
int ALU_COMPUTATION_RESULT(struct ALU_8_BIT *alu_one) {
    if (!alu_one) return -1;

    if (alu_one->operator_type == 1) { /* arithmetic */
        if (strcmp(alu_one->operator, "ADD") == 0) {
            return (alu_one->operand_one + alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "SUB") == 0) {
            return (alu_one->operand_one - alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "MUL") == 0) {
            return (alu_one->operand_one * alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "DIV") == 0) {
            if (alu_one->operand_two == 0) return -1;
            return (alu_one->operand_one / alu_one->operand_two) & 0xFF;
        } else {
            return -1;
        }
    } else if (alu_one->operator_type == 0) { /* logical (bitwise) */
        if (strcmp(alu_one->operator, "OR") == 0) {
            return (alu_one->operand_one | alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "AND") == 0) {
            return (alu_one->operand_one & alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "XOR") == 0) {
            return (alu_one->operand_one ^ alu_one->operand_two) & 0xFF;
        } else if (strcmp(alu_one->operator, "XNOR") == 0) {
            return (~(alu_one->operand_one ^ alu_one->operand_two)) & 0xFF;
        } else if (strcmp(alu_one->operator, "NOR") == 0) {
            return (~(alu_one->operand_one | alu_one->operand_two)) & 0xFF;
        } else if (strcmp(alu_one->operator, "NAND") == 0) {
            return (~(alu_one->operand_one & alu_one->operand_two)) & 0xFF;
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}

/* STORE OPERATIONS FOR INTEGER OPERANDS
   Return 0 on success, -1 on failure */
int STORE_INTEGER(const char INT_REG[6], int operand) {
    if (strcmp(INT_REG, "Ri_0") == 0) {
        Ri_0 = operand & 0xFF;
        return 0;
    } else if (strcmp(INT_REG, "Ri_1") == 0) {
        Ri_1 = operand & 0xFF;
        return 0;
    } else if (strcmp(INT_REG, "Ri_2") == 0) {
        Ri_2 = operand & 0xFF;
        return 0;
    } else {
        return -1;
    }
}

/* STORE OPERATIONS FOR CHARACTER VALUES */
int STORE_CHARACTER(const char CHAR_REG[6], int operand) {
    if (strcmp(CHAR_REG, "Rc_0") == 0) {
        Rc_0 = (char)(operand & 0xFF);
        return 0;
    } else if (strcmp(CHAR_REG, "Rc_1") == 0) {
        Rc_1 = (char)(operand & 0xFF);
        return 0;
    } else if (strcmp(CHAR_REG, "Rc_2") == 0) {
        Rc_2 = (char)(operand & 0xFF);
        return 0;
    } else {
        return -1;
    }
}

/* LOAD INTEGER VALUES FROM INTEGER REGISTER */
int LOAD_INTEGER_MDR(const char INT_REG[6]) {
    if (strcmp(INT_REG, "Ri_0") == 0) return Ri_0;
    if (strcmp(INT_REG, "Ri_1") == 0) return Ri_1;
    if (strcmp(INT_REG, "Ri_2") == 0) return Ri_2;
    return -1;
}

/* LOAD CHARACTER VALUES FROM CHARACTER REGISTER (returned as int) */
int LOAD_CHARACTER_MDR(const char CHAR_REG[6]) {
    if (strcmp(CHAR_REG, "Rc_0") == 0) return (int)Rc_0;
    if (strcmp(CHAR_REG, "Rc_1") == 0) return (int)Rc_1;
    if (strcmp(CHAR_REG, "Rc_2") == 0) return (int)Rc_2;
    return -1;
}

/* helper: map a register-name string to its integer value (search both numeric and char regs).
   returns 0 on success and sets *out, or -1 on failure */
int get_register_value(const char *regname, int *out) {
    if (!regname || !out) return -1;
    if (strcmp(regname, "Ri_0") == 0) { *out = Ri_0; return 0; }
    if (strcmp(regname, "Ri_1") == 0) { *out = Ri_1; return 0; }
    if (strcmp(regname, "Ri_2") == 0) { *out = Ri_2; return 0; }
    if (strcmp(regname, "Rc_0") == 0) { *out = (int)Rc_0; return 0; }
    if (strcmp(regname, "Rc_1") == 0) { *out = (int)Rc_1; return 0; }
    if (strcmp(regname, "Rc_2") == 0) { *out = (int)Rc_2; return 0; }
    return -1;
}

/* INSTRUCTION DECODING FOR REGISTER ADDRESSING MODE
   Returns ALU result or -1 on error */
int INSTRUCTION_DECODER_RAM(struct INSTRUCTION_REGISTER_RAM IDR) {
    struct ALU_8_BIT alu_one;
    int v1, v2;

    if (get_register_value(IDR.operand_one, &v1) != 0) return -1;
    if (get_register_value(IDR.operand_two, &v2) != 0) return -1;

    if (strcmp(IDR.alu_opcode, "ADD") == 0 ||
        strcmp(IDR.alu_opcode, "SUB") == 0 ||
        strcmp(IDR.alu_opcode, "MUL") == 0 ||
        strcmp(IDR.alu_opcode, "DIV") == 0) {
        alu_one.operator_type = 1;
    } else {
        /* assume logical if opcode is a logical operator */
        alu_one.operator_type = 0;
    }

    strncpy(alu_one.operator, IDR.alu_opcode, sizeof(alu_one.operator)-1);
    alu_one.operator[sizeof(alu_one.operator)-1] = '\0';
    alu_one.operand_one = v1;
    alu_one.operand_two = v2;

    return ALU_COMPUTATION_RESULT(&alu_one);
}

int INSTRUCTION_DECODER_RAM_WRAPPER(const char *alu_opcode, const char *op1, const char *op2) {
    struct INSTRUCTION_REGISTER_RAM IDR;
    strcpy(IDR.alu_opcode, alu_opcode);
    strcpy(IDR.operand_one, op1);
    strcpy(IDR.operand_two, op2);
    return INSTRUCTION_DECODER_RAM(IDR);
}


/* INSTRUCTION DECODER FOR DIRECT ADDRESSING MODE
   Returns ALU result or -1 on error */
int INSTRUCTION_DECODER_DAA(struct INSTRUCTION_REGISTER_DAM IDD) {
    struct ALU_8_BIT alu_one;

    if (strcmp(IDD.alu_opcode, "ADD") == 0 ||
        strcmp(IDD.alu_opcode, "SUB") == 0 ||
        strcmp(IDD.alu_opcode, "MUL") == 0 ||
        strcmp(IDD.alu_opcode, "DIV") == 0) {
        alu_one.operator_type = 1;
    } else {
        alu_one.operator_type = 0;
    }

    strncpy(alu_one.operator, IDD.alu_opcode, sizeof(alu_one.operator)-1);
    alu_one.operator[sizeof(alu_one.operator)-1] = '\0';
    alu_one.operand_one = IDD.operand_one;
    alu_one.operand_two = IDD.operand_two;

    return ALU_COMPUTATION_RESULT(&alu_one);
}

/* store into memory safely (8-bit masked) */
void STORE_MEMORY(int address, int value) {
    if (address >= 0 && address < 256) {
        memory[address] = value & 0xFF;
    }
}

/* PROGRAM COUNTERS: walk the address range and execute instruction if address matches */
void PROGRAM_COUNTER_DAM(int starting_address, int last_address, struct INSTRUCTION_REGISTER_2 ir) {
    for (int i = starting_address; i <= last_address; ++i) {
        if (i == ir.address) {
            int res = INSTRUCTION_DECODER_DAA(ir.IRD);
            /* store result somewhere or print — for demo print */
            printf("[DAM] Executed at address %d: result = %d\n", i, res);
        }
    }
}

void PROGRAM_COUNTER_RAM(int starting_address, int last_address, struct INSTRUCTION_REGISTER_1 ir) {
    for (int i = starting_address; i <= last_address; ++i) {
        if (i == ir.address) {
            int res = INSTRUCTION_DECODER_RAM(ir.IRM);
            printf("[RAM] Executed at address %d: result = %d\n", i, res);
        }
    }
}

/* MAR functions: simple implementations returning IR if address matches.
   If not match, return a zeroed struct. */
struct INSTRUCTION_REGISTER_RAM MAR_R(int address, struct INSTRUCTION_REGISTER_1 *ir) {
    struct INSTRUCTION_REGISTER_RAM empty = { .alu_opcode = "", .operand_one = "", .operand_two = "" };
    if (!ir) return empty;
    if (ir->address == address) return ir->IRM;
    return empty;
}

struct INSTRUCTION_REGISTER_DAM MAR_D(int address, struct INSTRUCTION_REGISTER_2 *ir) {
    struct INSTRUCTION_REGISTER_DAM empty = { .alu_opcode = "", .operand_one = 0, .operand_two = 0 };
    if (!ir) return empty;
    if (ir->address == address) return ir->IRD;
    return empty;
}

int INSTRUCTION_DECODER_DAA_WRAPPER(const char *opcode, int op1, int op2) {
    struct INSTRUCTION_REGISTER_DAM IDD;
    strcpy(IDD.alu_opcode, opcode);
    IDD.operand_one = op1;
    IDD.operand_two = op2;
    return INSTRUCTION_DECODER_DAA(IDD);
}


/* Simple demo main to show usage */
int main(void) {
    /* set some registers */
    STORE_INTEGER("Ri_0", 10);
    STORE_INTEGER("Ri_1", 25);
    STORE_INTEGER("Ri_2", 5);

    /* example: register addressing ADD Ri_0 + Ri_1 at address 10 */
    struct INSTRUCTION_REGISTER_1 ir1;
    ir1.address = 10;
    strcpy(ir1.IRM.alu_opcode, "ADD");
    strcpy(ir1.IRM.operand_one, "Ri_0");
    strcpy(ir1.IRM.operand_two, "Ri_1");

    PROGRAM_COUNTER_RAM(0, 20, ir1); /* this will execute and print result */

    /* example: direct addressing MUL 6 * 7 at address 15 */
    struct INSTRUCTION_REGISTER_2 ir2;
    ir2.address = 15;
    strcpy(ir2.IRD.alu_opcode, "MUL");
    ir2.IRD.operand_one = 6;
    ir2.IRD.operand_two = 7;

    PROGRAM_COUNTER_DAM(10, 20, ir2); /* execute direct-mode and print */

    /* example: store ALU result into memory (simple demonstration) */
    int addres = 20;
    int result = INSTRUCTION_DECODER_RAM(ir1.IRM);
    if (result >= 0) STORE_MEMORY(addres, result);
    printf("memory[%d] = %d\n", addres, memory[addres]);

    return 0;
}
