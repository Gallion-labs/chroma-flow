import subprocess
from typing import Optional, Dict, List
import os
from datetime import datetime

class PrintManager:
    def __init__(self):
        self.default_printer = self._get_default_printer()

    def _get_default_printer(self) -> Optional[str]:
        try:
            cmd = ['lpstat', '-d']
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and result.stdout:
                return result.stdout.strip().split(': ')[-1]
            
            printers = self.get_available_printers()
            return printers[0] if printers else None
            
        except Exception as e:
            print(f"Error getting default printer: {e}")
            return None

    def get_available_printers(self) -> List[str]:
        try:
            cmd = ['lpstat', '-p']
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                printers = []
                for line in result.stdout.split('\n'):
                    if line.startswith('printer'):
                        printers.append(line.split()[1])
                return printers
            return []
            
        except Exception as e:
            print(f"Error getting available printers: {e}")
            return []

    def print_image(self, image_path: str, options: Optional[Dict[str, str]] = None) -> bool:
        if not os.path.exists(image_path):
            print(f"Error: File not found - {image_path}")
            return False

        if not self.default_printer:
            print("Error: No printer available")
            return False

        try:
            cmd = ['lpr', '-P', self.default_printer]
            
            if options:
                for key, value in options.items():
                    cmd.extend([f'-o', f'{key}={value}'])
            
            cmd.append(image_path)
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            return result.returncode == 0
                
        except Exception as e:
            print(f"Error printing: {e}")
            return False