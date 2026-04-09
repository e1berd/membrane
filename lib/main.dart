import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:membrane/screens/login_screen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'providers/settings_providers.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Supabase.initialize(
      url: 'http://127.0.0.1:54321',
      anonKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
    );
  } catch (e) {
    print('Failed to initialize Supabase: $e');
    rethrow;
  }
  runApp(
    const ProviderScope(
      child: MembraneApp(),
    ),
  );
}

class MembraneApp extends ConsumerWidget {
  const MembraneApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeSettingsProvider);



    return MaterialApp(
      title: 'Membrane',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: .light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: .dark,
        ),
        useMaterial3: true,
      ),
      themeMode: themeMode,
      home: LoginScreen(),
    );
  }
}
