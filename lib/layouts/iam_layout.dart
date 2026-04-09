import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:membrane/providers/settings_providers.dart';

class IamLayout extends ConsumerWidget {
  IamLayout({required this.child, super.key});

  final Widget child;
  final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier(ThemeMode.dark);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeSettingsProvider);
    final isDark = themeMode == ThemeMode.dark;


    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            onPressed: () =>
                ref.read(themeSettingsProvider.notifier).toggle(),
            icon: Icon(isDark ? Icons.wb_sunny : Icons.shield_moon),
          )
        ],
      ),
      body: Center(
        child: child,
      ),
    );
  }
}
