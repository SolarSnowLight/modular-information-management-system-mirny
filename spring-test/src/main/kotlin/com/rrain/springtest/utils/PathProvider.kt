package com.rrain.springtest.utils

import java.nio.file.Paths


object PathProvider {
    // get path to project folder, e.g. "D:\PROG\Kotlin\[projects]\kotlin-test"
    val absPath = Paths.get("").toAbsolutePath()
}