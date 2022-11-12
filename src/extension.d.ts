declare module "react-drag-drop-files";

interface String {
    CapitalizeFirstLetter(): string;
    CapitalizeEachFirstLetter(): string;
    ToIntegerFromIndCurrency(): number;
    CutText(lengt: number): string;
}

interface Number {
    ToIndCurrency(prefix?: string): string;
}