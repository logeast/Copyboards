//
//  CopyboardsApp.swift
//  Copyboards
//
//  Created by logeast on 2023/6/28.
//

import SwiftUI

@main
struct CopyboardsApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
