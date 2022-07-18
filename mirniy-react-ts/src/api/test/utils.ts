



export type GraphQlData<D> = {
    errors?: Array<{
        message: string,
        locations: Array<{ line: number, column: number }>,
        path: string[],
        extensions: { classification: 'InvalidSyntax' | 'INTERNAL_ERROR' | string }
    }>
    data?: D
}